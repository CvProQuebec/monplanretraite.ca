import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { 
  Home, 
  Building2, 
  Calculator, 
  TrendingUp, 
  MapPin, 
  DollarSign,
  Info,
  Shield,
  Users,
  Mountain,
  Car,
  TreePine
} from 'lucide-react';
import { useLanguage } from '@/features/retirement/hooks/useLanguage';

// Données initiales vides pour la confidentialité
const initialImmobilierData = {
  residencePrincipale: {
    valeur: 0,
    hypotheque: 0,
    taxes: 0,
    assurances: 0
  },
  deuxiemeResidence: {
    valeur: 0,
    hypotheque: 0,
    revenus: 0,
    charges: 0
  },
  troisiemePropriete: {
    valeur: 0,
    hypotheque: 0,
    revenus: 0,
    charges: 0
  },
  quatriemePropriete: {
    valeur: 0,
    hypotheque: 0,
    revenus: 0,
    charges: 0
  }
};

const ImmobilierPage: React.FC = () => {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState('residence');
  const [immobilierData, setImmobilierData] = useState(initialImmobilierData);

  const handleChange = (section: string, field: string, value: string | number) => {
    // Traiter les leading zeros et convertir en nombre
    let numericValue: number;
    
    if (typeof value === 'string') {
      // Éliminer les leading zeros et convertir en nombre
      const cleanValue = value.replace(/^0+/, '') || '0';
      numericValue = Number(cleanValue);
    } else {
      numericValue = value;
    }
    
    setImmobilierData(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [field]: numericValue
      }
    }));
  };

  // Fonction pour formater les pourcentages selon les normes OQLF
  const formatPourcentageOQLF = (pourcentage: number): string => {
    if (pourcentage === 0) return '0 %';
    if (pourcentage === 100) return '100 %';
    
    // Pour les autres valeurs, arrondir à l'entier le plus proche
    const pourcentageArrondi = Math.round(pourcentage);
    return `${pourcentageArrondi} %`;
  };

  const t = {
    fr: {
      title: 'Gestion immobilière',
      subtitle: 'Planifiez votre patrimoine immobilier pour optimiser votre retraite',
      residence: 'Résidence principale',
      deuxiemeResidence: '2e résidence',
      troisiemePropriete: '3e propriété (à revenus)',
      quatriemePropriete: '4e propriété (chalet, etc.)',
      valeurActuelle: 'Valeur actuelle',
      soldeHypotheque: 'Solde d\'hypothèque',
      revenus: 'Revenus locatifs',
      charges: 'Charges annuelles',
      revenusNets: 'Revenus nets',
      taxes: 'Taxes municipales',
      assurances: 'Assurances',
      equite: 'Équité nette',
      patrimoineTotal: 'Patrimoine immobilier total',
      conseils: 'Conseils d\'optimisation',
      analyse: 'Analyse financière'
    },
    en: {
      title: 'Real Estate Management',
      subtitle: 'Plan your real estate portfolio to optimize your retirement',
      residence: 'Primary residence',
      deuxiemeResidence: '2nd residence',
      troisiemePropriete: '3rd property (income)',
      quatriemePropriete: '4th property (cottage, etc.)',
      valeurActuelle: 'Current value',
      soldeHypotheque: 'Mortgage balance',
      revenus: 'Rental income',
      charges: 'Annual expenses',
      taxes: 'Municipal taxes',
      assurances: 'Insurance',
      equite: 'Net equity',
      patrimoineTotal: 'Total real estate portfolio',
      conseils: 'Optimization advice',
      analyse: 'Financial analysis'
    }
  };

  const currentT = t[language as keyof typeof t];

  // Calculs
  const calculerEquite = (valeur: number, hypotheque: number) => Math.max(0, valeur - hypotheque);
  const equiteResidence = calculerEquite(immobilierData.residencePrincipale.valeur, immobilierData.residencePrincipale.hypotheque);
  const equite2e = calculerEquite(immobilierData.deuxiemeResidence.valeur, immobilierData.deuxiemeResidence.hypotheque);
  const equite3e = calculerEquite(immobilierData.troisiemePropriete.valeur, immobilierData.troisiemePropriete.hypotheque);
  const equite4e = calculerEquite(immobilierData.quatriemePropriete.valeur, immobilierData.quatriemePropriete.hypotheque);
  
  const patrimoineTotal = equiteResidence + equite2e + equite3e + equite4e;
  const revenusTotaux = immobilierData.deuxiemeResidence.revenus + immobilierData.troisiemePropriete.revenus + immobilierData.quatriemePropriete.revenus;
  const chargesTotales = immobilierData.deuxiemeResidence.charges + immobilierData.troisiemePropriete.charges + immobilierData.quatriemePropriete.charges;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white">
      {/* Particules de fond */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-3 h-3 bg-indigo-400 rounded-full animate-bounce"></div>
        <div className="absolute top-60 left-1/4 w-2 h-2 bg-purple-400 rounded-full animate-ping"></div>
      </div>

      <div className="container mx-auto px-6 py-8 relative z-10">
        {/* En-tête */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-6">
            <Home className="w-16 h-16 text-blue-400" />
            <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent drop-shadow-2xl">
              {currentT.title}
            </h1>
          </div>
          <p className="text-2xl text-blue-200 max-w-4xl mx-auto leading-relaxed">
            {currentT.subtitle}
          </p>
        </div>

        {/* Métriques principales */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-6 text-center">
              <Home className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <p className="text-2xl font-bold text-blue-200">
                {patrimoineTotal.toLocaleString()} $
              </p>
              <p className="text-blue-300">{currentT.patrimoineTotal}</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-6 text-center">
              <DollarSign className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <p className="text-2xl font-bold text-green-200">
                {revenusTotaux.toLocaleString()} $
              </p>
              <p className="text-green-300">{language === 'fr' ? 'Revenus locatifs annuels' : 'Annual rental income'}</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-6 text-center">
              <Calculator className="w-12 h-12 text-orange-400 mx-auto mb-4" />
              <p className="text-2xl font-bold text-orange-200">
                {chargesTotales.toLocaleString()} $
              </p>
              <p className="text-orange-300">{language === 'fr' ? 'Charges annuelles' : 'Annual expenses'}</p>
            </CardContent>
          </Card>
        </div>

        {/* Navigation par onglets */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardContent className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4 bg-white/20 p-2 rounded-xl h-16 border-2 border-white/30 shadow-lg">
                <TabsTrigger 
                  value="residence" 
                  className="data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-200 px-6 py-3 text-lg font-bold rounded-lg transition-all duration-200 data-[state=inactive]:bg-white/20 data-[state=inactive]:text-white data-[state=inactive]:hover:bg-white/30"
                >
                  <Home className="w-5 h-5 mr-2" />
                  {currentT.residence}
                </TabsTrigger>
                <TabsTrigger 
                  value="deuxieme"
                  className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg focus:outline-none focus:ring-4 focus:ring-indigo-200 px-6 py-3 text-lg font-bold rounded-lg transition-all duration-200 data-[state=inactive]:bg-white/20 data-[state=inactive]:text-white data-[state=inactive]:hover:bg-white/30"
                >
                  <Building2 className="w-5 h-5 mr-2" />
                  {currentT.deuxiemeResidence}
                </TabsTrigger>
                <TabsTrigger 
                  value="troisieme"
                  className="data-[state=active]:bg-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg focus:outline-none focus:ring-4 focus:ring-purple-200 px-6 py-3 text-lg font-bold rounded-lg transition-all duration-200 data-[state=inactive]:bg-white/20 data-[state=inactive]:text-white data-[state=inactive]:hover:bg-white/30"
                >
                  <TrendingUp className="w-5 h-5 mr-2" />
                  {currentT.troisiemePropriete}
                </TabsTrigger>
                <TabsTrigger 
                  value="quatrieme"
                  className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-lg focus:outline-none focus:ring-4 focus:ring-emerald-200 px-6 py-3 text-lg font-bold rounded-lg transition-all duration-200 data-[state=inactive]:bg-white/20 data-[state=inactive]:text-white data-[state=inactive]:hover:bg-white/30"
                >
                  <Mountain className="w-5 h-5 mr-2" />
                  {currentT.quatriemePropriete}
                </TabsTrigger>
              </TabsList>

              {/* Onglet Résidence principale */}
              <TabsContent value="residence" className="mt-8">
                <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                  <CardHeader>
                    <CardTitle className="text-2xl text-blue-200 flex items-center gap-3">
                      <Home className="w-8 h-8 text-blue-400" />
                      {currentT.residence}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <Label className="text-lg font-semibold text-blue-200">
                          {currentT.valeurActuelle}
                        </Label>
                        <Input
                          type="number"
                          value={immobilierData.residencePrincipale.valeur}
                          onChange={(e) => handleChange('residencePrincipale', 'valeur', e.target.value)}
                          className="text-xl p-4 bg-white/20 border-white/30 text-white placeholder-blue-200"
                          placeholder="0"
                        />
                      </div>
                      <div className="space-y-3">
                        <Label className="text-lg font-semibold text-blue-200">
                          {currentT.soldeHypotheque}
                        </Label>
                        <Input
                          type="number"
                          value={immobilierData.residencePrincipale.hypotheque}
                          onChange={(e) => handleChange('residencePrincipale', 'hypotheque', e.target.value)}
                          className="text-xl p-4 bg-white/20 border-white/30 text-white placeholder-blue-200"
                          placeholder="0"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <Label className="text-lg font-semibold text-blue-200">
                          {currentT.taxes}
                        </Label>
                        <Input
                          type="number"
                          value={immobilierData.residencePrincipale.taxes}
                          onChange={(e) => handleChange('residencePrincipale', 'taxes', e.target.value)}
                          className="text-xl p-4 bg-white/20 border-white/30 text-white placeholder-blue-200"
                          placeholder="0"
                        />
                      </div>
                      <div className="space-y-3">
                        <Label className="text-lg font-semibold text-blue-200">
                          {currentT.assurances}
                        </Label>
                        <Input
                          type="number"
                          value={immobilierData.residencePrincipale.assurances}
                          onChange={(e) => handleChange('residencePrincipale', 'assurances', e.target.value)}
                          className="text-xl p-4 bg-white/20 border-white/30 text-white placeholder-blue-200"
                          placeholder="0"
                        />
                      </div>
                    </div>

                    {/* Résumé de l'équité */}
                    <div className="bg-blue-500/20 p-6 rounded-lg border border-blue-400/30">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-blue-200 mb-2">
                          {currentT.equite}: {equiteResidence.toLocaleString()} $
                        </p>
                        <Progress 
                          value={immobilierData.residencePrincipale.valeur > 0 ? (equiteResidence / immobilierData.residencePrincipale.valeur) * 100 : 0} 
                          className="h-3 bg-blue-300/20"
                        />
                        <p className="text-blue-300 mt-2">
                          {immobilierData.residencePrincipale.valeur > 0 ? ((equiteResidence / immobilierData.residencePrincipale.valeur) * 100).toFixed(1) : 0}% d'équité
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Onglet 2e résidence */}
              <TabsContent value="deuxieme" className="mt-8">
                <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                  <CardHeader>
                    <CardTitle className="text-2xl text-indigo-200 flex items-center gap-3">
                      <Building2 className="w-8 h-8 text-indigo-400" />
                      {currentT.deuxiemeResidence}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <Label className="text-lg font-semibold text-indigo-200">
                          {currentT.valeurActuelle}
                        </Label>
                        <Input
                          type="number"
                          value={immobilierData.deuxiemeResidence.valeur}
                          onChange={(e) => handleChange('deuxiemeResidence', 'valeur', e.target.value)}
                          className="text-xl p-4 bg-white/20 border-white/30 text-white placeholder-indigo-200"
                          placeholder="0"
                        />
                      </div>
                      <div className="space-y-3">
                        <Label className="text-lg font-semibold text-indigo-200">
                          {currentT.soldeHypotheque}
                        </Label>
                        <Input
                          type="number"
                          value={immobilierData.deuxiemeResidence.hypotheque}
                          onChange={(e) => handleChange('deuxiemeResidence', 'hypotheque', e.target.value)}
                          className="text-xl p-4 bg-white/20 border-white/30 text-white placeholder-indigo-200"
                          placeholder="0"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <Label className="text-lg font-semibold text-indigo-200">
                          {currentT.revenus}
                        </Label>
                        <Input
                          type="number"
                          value={immobilierData.deuxiemeResidence.revenus}
                          onChange={(e) => handleChange('deuxiemeResidence', 'revenus', e.target.value)}
                          className="text-xl p-4 bg-white/20 border-white/30 text-white placeholder-indigo-200"
                          placeholder="0"
                        />
                      </div>
                      <div className="space-y-3">
                        <Label className="text-lg font-semibold text-indigo-200">
                          {currentT.charges}
                        </Label>
                        <Input
                          type="number"
                          value={immobilierData.deuxiemeResidence.charges}
                          onChange={(e) => handleChange('deuxiemeResidence', 'charges', e.target.value)}
                          className="text-xl p-4 bg-white/20 border-white/30 text-white placeholder-indigo-200"
                          placeholder="0"
                        />
                      </div>
                    </div>

                    {/* Résumé de l'équité */}
                    <div className="bg-indigo-500/20 p-6 rounded-lg border border-indigo-400/30">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-indigo-200 mb-2">
                          {currentT.equite}: {equite2e.toLocaleString()} $
                        </p>
                        <p className="text-indigo-300">
                          Revenus nets: {(immobilierData.deuxiemeResidence.revenus - immobilierData.deuxiemeResidence.charges).toLocaleString()} $
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Onglet 3e propriété */}
              <TabsContent value="troisieme" className="mt-8">
                <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                  <CardHeader>
                    <CardTitle className="text-2xl text-purple-200 flex items-center gap-3">
                      <TrendingUp className="w-8 h-8 text-purple-400" />
                      {currentT.troisiemePropriete}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <Label className="text-lg font-semibold text-purple-200">
                          {currentT.valeurActuelle}
                        </Label>
                        <Input
                          type="number"
                          value={immobilierData.troisiemePropriete.valeur}
                          onChange={(e) => handleChange('troisiemePropriete', 'valeur', e.target.value)}
                          className="text-xl p-4 bg-white/20 border-white/30 text-white placeholder-purple-200"
                          placeholder="0"
                        />
                      </div>
                      <div className="space-y-3">
                        <Label className="text-lg font-semibold text-purple-200">
                          {currentT.soldeHypotheque}
                        </Label>
                        <Input
                          type="number"
                          value={immobilierData.troisiemePropriete.hypotheque}
                          onChange={(e) => handleChange('troisiemePropriete', 'hypotheque', e.target.value)}
                          className="text-xl p-4 bg-white/20 border-white/30 text-white placeholder-purple-200"
                          placeholder="0"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <Label className="text-lg font-semibold text-purple-200">
                          {currentT.revenus}
                        </Label>
                        <Input
                          type="number"
                          value={immobilierData.troisiemePropriete.revenus}
                          onChange={(e) => handleChange('troisiemePropriete', 'revenus', e.target.value)}
                          className="text-xl p-4 bg-white/20 border-white/30 text-white placeholder-purple-200"
                          placeholder="0"
                        />
                      </div>
                      <div className="space-y-3">
                        <Label className="text-lg font-semibold text-purple-200">
                          {currentT.charges}
                        </Label>
                        <Input
                          type="number"
                          value={immobilierData.troisiemePropriete.charges}
                          onChange={(e) => handleChange('troisiemePropriete', 'charges', e.target.value)}
                          className="text-xl p-4 bg-white/20 border-white/30 text-white placeholder-purple-200"
                          placeholder="0"
                        />
                      </div>
                    </div>

                    {/* Résumé de l'équité */}
                    <div className="bg-purple-500/20 p-6 rounded-lg border border-purple-400/30">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-purple-200 mb-2">
                          {currentT.equite}: {equite3e.toLocaleString()} $
                        </p>
                        <p className="text-purple-300">
                          Revenus nets: {(immobilierData.troisiemePropriete.revenus - immobilierData.troisiemePropriete.charges).toLocaleString()} $
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Onglet 4e propriété */}
              <TabsContent value="quatrieme" className="mt-8">
                <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                  <CardHeader>
                    <CardTitle className="text-2xl text-emerald-200 flex items-center gap-3">
                      <Mountain className="w-8 h-8 text-emerald-400" />
                      {currentT.quatriemePropriete}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <Label className="text-lg font-semibold text-emerald-200">
                          {currentT.valeurActuelle}
                        </Label>
                        <Input
                          type="number"
                          value={immobilierData.quatriemePropriete.valeur}
                          onChange={(e) => handleChange('quatriemePropriete', 'valeur', e.target.value)}
                          className="text-xl p-4 bg-white/20 border-white/30 text-white placeholder-emerald-200"
                          placeholder="0"
                        />
                      </div>
                      <div className="space-y-3">
                        <Label className="text-lg font-semibold text-emerald-200">
                          {currentT.soldeHypotheque}
                        </Label>
                        <Input
                          type="number"
                          value={immobilierData.quatriemePropriete.hypotheque}
                          onChange={(e) => handleChange('quatriemePropriete', 'hypotheque', e.target.value)}
                          className="text-xl p-4 bg-white/20 border-white/30 text-white placeholder-emerald-200"
                          placeholder="0"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <Label className="text-lg font-semibold text-emerald-200">
                          {currentT.revenus}
                        </Label>
                        <Input
                          type="number"
                          value={immobilierData.quatriemePropriete.revenus}
                          onChange={(e) => handleChange('quatriemePropriete', 'revenus', e.target.value)}
                          className="text-xl p-4 bg-white/20 border-white/30 text-white placeholder-emerald-200"
                          placeholder="0"
                        />
                      </div>
                      <div className="space-y-3">
                        <Label className="text-lg font-semibold text-emerald-200">
                          {currentT.charges}
                        </Label>
                        <Input
                          type="number"
                          value={immobilierData.quatriemePropriete.charges}
                          onChange={(e) => handleChange('quatriemePropriete', 'charges', e.target.value)}
                          className="text-xl p-4 bg-white/20 border-white/30 text-white placeholder-emerald-200"
                          placeholder="0"
                        />
                      </div>
                    </div>

                    {/* Résumé de l'équité */}
                    <div className="bg-emerald-500/20 p-6 rounded-lg border border-emerald-400/30">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-emerald-200 mb-2">
                          {currentT.equite}: {equite4e.toLocaleString()} $
                        </p>
                        <p className="text-emerald-300">
                          Revenus nets: {(immobilierData.quatriemePropriete.revenus - immobilierData.quatriemePropriete.charges).toLocaleString()} $
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ImmobilierPage;
