import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card';
import { Button } from './button';
import { Badge } from './badge';
import { Alert, AlertDescription, AlertTitle } from './alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import { Input } from './input';
import { Label } from './label';
import { 
  Calculator, 
  TrendingDown, 
  TrendingUp, 
  DollarSign,
  Users,
  User,
  Heart,
  Info,
  CheckCircle,
  AlertTriangle,
  Zap,
  Gift,
  PieChart
} from 'lucide-react';

interface TaxCalculationData {
  maritalStatus: 'single' | 'couple';
  annualIncome: number;
  province: string;
  person1Income?: number;
  person2Income?: number;
}

interface TaxResult {
  before65: {
    federalTax: number;
    provincialTax: number;
    totalTax: number;
    effectiveRate: number;
    afterTaxIncome: number;
  };
  at65: {
    federalTax: number;
    provincialTax: number;
    totalTax: number;
    effectiveRate: number;
    afterTaxIncome: number;
    ageCredit: number;
    pensionCredit: number;
  };
  savings: {
    annualSavings: number;
    percentageReduction: number;
    lifetimeSavings: number; // Sur 20 ans
  };
}

const TaxImpactAt65Calculator: React.FC = () => {
  const [data, setData] = useState<TaxCalculationData>({
    maritalStatus: 'single',
    annualIncome: 60000,
    province: 'QC',
    person1Income: 30000,
    person2Income: 30000
  });

  const [results, setResults] = useState<TaxResult | null>(null);
  const [activeTab, setActiveTab] = useState('calculator');

  const updateData = (field: keyof TaxCalculationData, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  // Données des crédits par province (2024)
  const provincialAgeCredits = {
    'QC': { federal: 8790, provincial: 3410 },
    'ON': { federal: 8790, provincial: 5315 },
    'BC': { federal: 8790, provincial: 4605 },
    'AB': { federal: 8790, provincial: 4605 },
    'SK': { federal: 8790, provincial: 4605 },
    'MB': { federal: 8790, provincial: 4605 },
    'NB': { federal: 8790, provincial: 4605 },
    'NS': { federal: 8790, provincial: 4605 },
    'PE': { federal: 8790, provincial: 4605 },
    'NL': { federal: 8790, provincial: 4605 },
    'YT': { federal: 8790, provincial: 4605 },
    'NT': { federal: 8790, provincial: 4605 },
    'NU': { federal: 8790, provincial: 4605 }
  };

  // Taux d'imposition simplifiés par province (approximatifs)
  const taxRates = {
    'QC': { federal: 0.15, provincial: 0.16, combined: 0.31 },
    'ON': { federal: 0.15, provincial: 0.0505, combined: 0.2005 },
    'BC': { federal: 0.15, provincial: 0.0506, combined: 0.2006 },
    'AB': { federal: 0.15, provincial: 0.10, combined: 0.25 },
    'SK': { federal: 0.15, provincial: 0.105, combined: 0.255 },
    'MB': { federal: 0.15, provincial: 0.108, combined: 0.258 },
    'NB': { federal: 0.15, provincial: 0.094, combined: 0.244 },
    'NS': { federal: 0.15, provincial: 0.0879, combined: 0.2379 },
    'PE': { federal: 0.15, provincial: 0.098, combined: 0.248 },
    'NL': { federal: 0.15, provincial: 0.087, combined: 0.237 },
    'YT': { federal: 0.15, provincial: 0.064, combined: 0.214 },
    'NT': { federal: 0.15, provincial: 0.059, combined: 0.209 },
    'NU': { federal: 0.15, provincial: 0.04, combined: 0.19 }
  };

  const calculateTaxes = (): TaxResult | null => {
    const income = data.maritalStatus === 'couple' 
      ? (data.person1Income || 0) + (data.person2Income || 0)
      : data.annualIncome;

    if (income <= 0) return null;

    const rates = taxRates[data.province as keyof typeof taxRates];
    const credits = provincialAgeCredits[data.province as keyof typeof provincialAgeCredits];

    // Calcul avant 65 ans
    const grossTaxBefore = income * rates.combined;
    const before65 = {
      federalTax: income * rates.federal,
      provincialTax: income * rates.provincial,
      totalTax: grossTaxBefore,
      effectiveRate: (grossTaxBefore / income) * 100,
      afterTaxIncome: income - grossTaxBefore
    };

    // Calcul à 65 ans avec crédits
    const ageCredit = credits.federal * 0.15 + credits.provincial * rates.provincial; // Crédit d'âge
    const pensionCredit = 2000 * 0.15; // Crédit de pension fédéral (300$)
    const totalCredits = ageCredit + pensionCredit;

    // Pour les couples, doubler les crédits de pension
    const adjustedCredits = data.maritalStatus === 'couple' ? totalCredits + pensionCredit : totalCredits;

    const grossTaxAt65 = Math.max(0, grossTaxBefore - adjustedCredits);
    const at65 = {
      federalTax: Math.max(0, before65.federalTax - (adjustedCredits * 0.6)),
      provincialTax: Math.max(0, before65.provincialTax - (adjustedCredits * 0.4)),
      totalTax: grossTaxAt65,
      effectiveRate: (grossTaxAt65 / income) * 100,
      afterTaxIncome: income - grossTaxAt65,
      ageCredit: ageCredit,
      pensionCredit: data.maritalStatus === 'couple' ? pensionCredit * 2 : pensionCredit
    };

    const annualSavings = before65.totalTax - at65.totalTax;
    const percentageReduction = ((annualSavings / before65.totalTax) * 100);

    return {
      before65,
      at65,
      savings: {
        annualSavings,
        percentageReduction,
        lifetimeSavings: annualSavings * 20 // Sur 20 ans
      }
    };
  };

  useEffect(() => {
    const result = calculateTaxes();
    setResults(result);
  }, [data]);

  const getImpactLevel = (savings: number) => {
    if (savings > 3000) return { level: 'ÉNORME', color: 'green', icon: <Zap className="w-4 h-4" /> };
    if (savings > 1500) return { level: 'IMPORTANT', color: 'blue', icon: <TrendingDown className="w-4 h-4" /> };
    if (savings > 500) return { level: 'MODÉRÉ', color: 'yellow', icon: <Info className="w-4 h-4" /> };
    return { level: 'MINIMAL', color: 'gray', icon: <AlertTriangle className="w-4 h-4" /> };
  };

  const impact = results ? getImpactLevel(results.savings.annualSavings) : null;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* En-tête */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-4">
          Impact Fiscal à 65 ans
        </h1>
        <p className="text-xl text-gray-600 max-w-4xl mx-auto">
          Découvrez combien vous économiserez en impôts simplement en atteignant 65 ans. 
          L'impact peut être dramatique, surtout pour les couples !
        </p>
      </div>

      {/* Alerte importante */}
      <Alert className="border-blue-500 bg-blue-50">
        <Gift className="h-5 w-5 text-blue-500" />
        <AlertTitle className="text-blue-800">🎁 CADEAU DU GOUVERNEMENT À 65 ANS</AlertTitle>
        <AlertDescription className="text-blue-700 text-lg">
          <strong>Juste en vieillissant, vous payez moins d'impôts !</strong> Les crédits d'âge et de pension 
          peuvent vous faire économiser des milliers de dollars par année. C'est automatique, mais il faut 
          connaître les montants pour bien planifier.
        </AlertDescription>
      </Alert>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="calculator">Calculateur</TabsTrigger>
          <TabsTrigger value="comparison">Comparaison</TabsTrigger>
          <TabsTrigger value="strategies">Stratégies</TabsTrigger>
        </TabsList>

        {/* Onglet Calculateur */}
        <TabsContent value="calculator" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Formulaire */}
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Calculator className="w-6 h-6 text-blue-600" />
                  Vos informations
                </CardTitle>
                <CardDescription>
                  Entrez vos données pour calculer l'impact fiscal
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label>Statut matrimonial</Label>
                  <Select value={data.maritalStatus} onValueChange={(value: any) => updateData('maritalStatus', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="single">Célibataire</SelectItem>
                      <SelectItem value="couple">Couple (marié ou conjoint de fait)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Province de résidence</Label>
                  <Select value={data.province} onValueChange={(value) => updateData('province', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="QC">Québec</SelectItem>
                      <SelectItem value="ON">Ontario</SelectItem>
                      <SelectItem value="BC">Colombie-Britannique</SelectItem>
                      <SelectItem value="AB">Alberta</SelectItem>
                      <SelectItem value="SK">Saskatchewan</SelectItem>
                      <SelectItem value="MB">Manitoba</SelectItem>
                      <SelectItem value="NB">Nouveau-Brunswick</SelectItem>
                      <SelectItem value="NS">Nouvelle-Écosse</SelectItem>
                      <SelectItem value="PE">Île-du-Prince-Édouard</SelectItem>
                      <SelectItem value="NL">Terre-Neuve-et-Labrador</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {data.maritalStatus === 'single' ? (
                  <div>
                    <Label>Revenu annuel de retraite</Label>
                    <Input
                      type="number"
                      value={data.annualIncome}
                      onChange={(e) => updateData('annualIncome', Number(e.target.value))}
                      placeholder="Ex: 60000"
                    />
                  </div>
                ) : (
                  <>
                    <div>
                      <Label>Revenu annuel - Personne 1</Label>
                      <Input
                        type="number"
                        value={data.person1Income}
                        onChange={(e) => updateData('person1Income', Number(e.target.value))}
                        placeholder="Ex: 30000"
                      />
                    </div>
                    <div>
                      <Label>Revenu annuel - Personne 2</Label>
                      <Input
                        type="number"
                        value={data.person2Income}
                        onChange={(e) => updateData('person2Income', Number(e.target.value))}
                        placeholder="Ex: 30000"
                      />
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Résultats */}
            {results && (
              <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <TrendingDown className="w-6 h-6 text-green-600" />
                    Vos économies d'impôts
                    {impact && (
                      <Badge variant="outline" className={`bg-${impact.color}-100 text-${impact.color}-800 border-${impact.color}-300`}>
                        {impact.icon}
                        {impact.level}
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Économies annuelles */}
                  <div className="text-center p-6 bg-white rounded-lg border border-green-200">
                    <div className="text-3xl font-bold text-green-600 mb-2">
                      ${results.savings.annualSavings.toLocaleString()}
                    </div>
                    <div className="text-lg text-gray-700 mb-1">Économies annuelles</div>
                    <div className="text-sm text-gray-500">
                      Réduction de {results.savings.percentageReduction.toFixed(1)}% de vos impôts
                    </div>
                  </div>

                  {/* Comparaison avant/après */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
                      <div className="text-lg font-bold text-red-600">
                        ${results.before65.totalTax.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600">Avant 65 ans</div>
                      <div className="text-xs text-gray-500">
                        {results.before65.effectiveRate.toFixed(1)}% effectif
                      </div>
                    </div>
                    
                    <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                      <div className="text-lg font-bold text-green-600">
                        ${results.at65.totalTax.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600">À 65 ans</div>
                      <div className="text-xs text-gray-500">
                        {results.at65.effectiveRate.toFixed(1)}% effectif
                      </div>
                    </div>
                  </div>

                  {/* Économies à vie */}
                  <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="text-2xl font-bold text-purple-600">
                      ${results.savings.lifetimeSavings.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-700">Économies sur 20 ans</div>
                    <div className="text-xs text-gray-500">De 65 à 85 ans</div>
                  </div>

                  {/* Détail des crédits */}
                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-800">Crédits appliqués à 65 ans :</h4>
                    <div className="text-sm space-y-1">
                      <div className="flex justify-between">
                        <span>Crédit d'âge :</span>
                        <span className="font-medium">${results.at65.ageCredit.toFixed(0)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Crédit de pension :</span>
                        <span className="font-medium">${results.at65.pensionCredit.toFixed(0)}</span>
                      </div>
                      <div className="border-t pt-1 flex justify-between font-semibold">
                        <span>Total des crédits :</span>
                        <span>${(results.at65.ageCredit + results.at65.pensionCredit).toFixed(0)}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Onglet Comparaison */}
        <TabsContent value="comparison" className="space-y-6">
          {results && (
            <>
              {/* Graphique de comparaison */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <PieChart className="w-6 h-6 text-purple-600" />
                    Comparaison détaillée
                  </CardTitle>
                  <CardDescription>
                    Impact des crédits fiscaux selon différents niveaux de revenus
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Revenus faibles */}
                    <div className="text-center p-6 bg-green-50 rounded-lg border border-green-200">
                      <h4 className="font-semibold text-green-800 mb-4">Revenus 40 000$ - 60 000$</h4>
                      <div className="space-y-2">
                        <div className="text-2xl font-bold text-green-600">15-25%</div>
                        <div className="text-sm text-gray-600">Réduction d'impôts</div>
                        <div className="text-xs text-gray-500">Impact MAJEUR</div>
                      </div>
                      <div className="mt-4 text-xs text-gray-600">
                        Les crédits ont un impact maximum à ces niveaux de revenus
                      </div>
                    </div>

                    {/* Revenus moyens */}
                    <div className="text-center p-6 bg-blue-50 rounded-lg border border-blue-200">
                      <h4 className="font-semibold text-blue-800 mb-4">Revenus 60 000$ - 80 000$</h4>
                      <div className="space-y-2">
                        <div className="text-2xl font-bold text-blue-600">8-15%</div>
                        <div className="text-sm text-gray-600">Réduction d'impôts</div>
                        <div className="text-xs text-gray-500">Impact IMPORTANT</div>
                      </div>
                      <div className="mt-4 text-xs text-gray-600">
                        Économies substantielles, surtout pour les couples
                      </div>
                    </div>

                    {/* Revenus élevés */}
                    <div className="text-center p-6 bg-yellow-50 rounded-lg border border-yellow-200">
                      <h4 className="font-semibold text-yellow-800 mb-4">Revenus 80 000$+</h4>
                      <div className="space-y-2">
                        <div className="text-2xl font-bold text-yellow-600">3-8%</div>
                        <div className="text-sm text-gray-600">Réduction d'impôts</div>
                        <div className="text-xs text-gray-500">Impact MODÉRÉ</div>
                      </div>
                      <div className="mt-4 text-xs text-gray-600">
                        Les crédits sont graduellement éliminés
                      </div>
                    </div>
                  </div>

                  {/* Avantage couples vs célibataires */}
                  <div className="mt-8 p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                    <h4 className="font-semibold text-purple-800 mb-4 flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      Avantage ÉNORME des couples
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h5 className="font-medium text-gray-800 mb-2">Célibataire - 60 000$</h5>
                        <div className="text-sm space-y-1">
                          <div className="flex justify-between">
                            <span>Impôts avant 65 :</span>
                            <span className="font-medium text-red-600">~$15 000</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Impôts à 65 :</span>
                            <span className="font-medium text-green-600">~$13 000</span>
                          </div>
                          <div className="flex justify-between font-semibold border-t pt-1">
                            <span>Économies :</span>
                            <span className="text-blue-600">~$2 000</span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h5 className="font-medium text-gray-800 mb-2">Couple - 60 000$ (30k chacun)</h5>
                        <div className="text-sm space-y-1">
                          <div className="flex justify-between">
                            <span>Impôts avant 65 :</span>
                            <span className="font-medium text-red-600">~$6 300</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Impôts à 65 :</span>
                            <span className="font-medium text-green-600">~$2 700</span>
                          </div>
                          <div className="flex justify-between font-semibold border-t pt-1">
                            <span>Économies :</span>
                            <span className="text-blue-600">~$3 600</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <Alert className="mt-4 border-purple-300 bg-purple-50">
                      <Heart className="h-4 w-4 text-purple-600" />
                      <AlertDescription className="text-purple-700">
                        <strong>Les couples économisent presque 2x plus !</strong> Le fractionnement de revenus 
                        et les crédits doublés créent un avantage fiscal majeur.
                      </AlertDescription>
                    </Alert>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        {/* Onglet Stratégies */}
        <TabsContent value="strategies" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Stratégies avant 65 ans */}
            <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <AlertTriangle className="w-6 h-6 text-orange-600" />
                  Avant 65 ans - Préparez-vous
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-white rounded-lg border">
                    <div className="w-6 h-6 bg-orange-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                    <div>
                      <div className="font-medium">Maximisez vos REER</div>
                      <div className="text-sm text-gray-600">Réduisez vos impôts maintenant, payez moins à la retraite</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 bg-white rounded-lg border">
                    <div className="w-6 h-6 bg-orange-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                    <div>
                      <div className="font-medium">Planifiez le fractionnement</div>
                      <div className="text-sm text-gray-600">Équilibrez les revenus entre conjoints</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 bg-white rounded-lg border">
                    <div className="w-6 h-6 bg-orange-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                    <div>
                      <div className="font-medium">Retardez la RRQ/CPP</div>
                      <div className="text-sm text-gray-600">Utilisez d'autres sources jusqu'à 70 ans</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 bg-white rounded-lg border">
                    <div className="w-6 h-6 bg-orange-600 text-white rounded-full flex items-center justify-center text-sm font-bold">4</div>
                    <div>
                      <div className="font-medium">Optimisez vos retraits</div>
                      <div className="text-sm text-gray-600">Videz les comptes imposables en premier</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stratégies à 65 ans et plus */}
            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  À 65 ans et plus - Maximisez
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-white rounded-lg border">
                    <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                    <div>
                      <div className="font-medium">Fractionnement de pension</div>
                      <div className="text-sm text-gray-600">Transférez jusqu'à 50% des revenus de pension</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 bg-white rounded-lg border">
                    <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                    <div>
                      <div className="font-medium">Crédit de pension</div>
                      <div className="text-sm text-gray-600">2 000$ de revenus de pension = 300$ de crédit</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 bg-white rounded-lg border">
                    <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                    <div>
                      <div className="font-medium">Crédit d'âge automatique</div>
                      <div className="text-sm text-gray-600">Jusqu'à 8 790$ de crédit fédéral</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 bg-white rounded-lg border">
                    <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">4</div>
                    <div>
                      <div className="font-medium">Surveillez les seuils</div>
                      <div className="text-sm text-gray-600">Évitez la récupération de la PSV</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Conseils d'experts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Zap className="w-6 h-6 text-purple-600" />
                Conseils d'experts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3 text-purple-800">💡 Optimisations avancées :</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Convertissez vos REER en FERR à 65 ans pour le crédit de pension</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Planifiez vos retraits pour rester sous les seuils de récupération</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Utilisez les crédits d'impôt pour dons de charité</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Considérez le report de la PSV jusqu'à 70 ans</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3 text-purple-800">⚠️ Pièges à éviter :</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                      <span>Ne pas planifier le fractionnement de revenus</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                      <span>Dépasser les seuils de récupération de la PSV</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                      <span>Oublier de demander tous les crédits disponibles</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                      <span>Ne pas réviser sa stratégie annuellement</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TaxImpactAt65Calculator;
