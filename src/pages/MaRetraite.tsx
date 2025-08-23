import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/features/retirement/hooks/useLanguage';
import { useRetirementData } from '@/features/retirement/hooks/useRetirementData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  DollarSign, 
  PiggyBank, 
  Home, 
  Calculator,
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Star,
  Building,
  CreditCard,
  BarChart3
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';


const MaRetraite: React.FC = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const isFrench = language === 'fr';
  const [activeTab, setActiveTab] = useState('revenus');
  
  // Hook pour les données de retraite
  const { userData, updateUserData } = useRetirementData();

  const [revenusData, setRevenusData] = useState({
    salaire: '',
    pensions: '',
    epargne: '',
    immobilier: '',
    autres: ''
  });

  // Synchronisation des données du profil avec la page revenus
  useEffect(() => {
    if (userData.personal) {
      // Synchroniser le salaire du profil avec la page revenus
      if (userData.personal.salaire1) {
        setRevenusData(prev => ({
          ...prev,
          salaire: userData.personal.salaire1.toString()
        }));
      }
    }
  }, [userData.personal]);

  // Synchronisation inverse : mettre à jour le profil quand le salaire change
  const handleRevenusChange = (field: string, value: string) => {
    setRevenusData(prev => ({ ...prev, [field]: value }));
    
    // Si c'est le salaire, mettre à jour le profil
    if (field === 'salaire') {
      const numericValue = parseFloat(value.replace(/[^\d.]/g, '')) || 0;
      updateUserData('personal', { salaire1: numericValue });
    }
  };

  const [depensesData, setDepensesData] = useState({
    logement: '',
    alimentation: '',
    transport: '',
    sante: '',
    loisirs: '',
    autres: ''
  });

  const [calculsData, setCalculsData] = useState({
    ageRetraite: '',
    revenusMensuels: '',
    depensesMensuelles: '',
    epargneNecessaire: ''
  });



  const handleDepensesChange = (field: string, value: string) => {
    setDepensesData(prev => ({ ...prev, [field]: value }));
  };

  const handleCalculsChange = (field: string, value: string) => {
    setCalculsData(prev => ({ ...prev, [field]: value }));
  };

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const getRevenusProgress = () => {
    const filledFields = Object.values(revenusData).filter(value => value.trim() !== '').length;
    return Math.round((filledFields / Object.keys(revenusData).length) * 100);
  };

  const getDepensesProgress = () => {
    const filledFields = Object.values(depensesData).filter(value => value.trim() !== '').length;
    return Math.round((filledFields / Object.keys(depensesData).length) * 100);
  };

  const getCalculsProgress = () => {
    const filledFields = Object.values(calculsData).filter(value => value.trim() !== '').length;
    return Math.round((filledFields / Object.keys(calculsData).length) * 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">

      
      <div className="container mx-auto px-6 py-12">
        {/* En-tête bienveillant */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <DollarSign className="w-12 h-12 text-purple-600" />
            <h1 className="text-4xl font-bold text-gray-900">
              {isFrench ? 'Ma retraite' : 'My retirement'}
            </h1>
          </div>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            {isFrench 
              ? 'Travaillons ensemble avec vos ressources réelles. Chaque source de revenus et chaque dépense compte pour créer votre plan personnalisé.'
              : 'Let\'s work together with your real resources. Every source of income and every expense counts to create your personalized plan.'
            }
          </p>
        </div>

        {/* Onglets thématiques */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="revenus" className="flex items-center gap-2">
              <Building className="w-5 h-5" />
              {isFrench ? 'Mes revenus et actifs' : 'My income and assets'}
            </TabsTrigger>
            <TabsTrigger value="depenses" className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              {isFrench ? 'Mes dépenses et budget' : 'My expenses and budget'}
            </TabsTrigger>
            <TabsTrigger value="calculs" className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              {isFrench ? 'Mes calculs de retraite' : 'My retirement calculations'}
            </TabsTrigger>
          </TabsList>

          {/* Onglet 1 : Revenus et actifs */}
          <TabsContent value="revenus" className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border-2 border-blue-200 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-blue-800">
                  <Building className="w-6 h-6" />
                  {isFrench ? 'Mes revenus et actifs' : 'My income and assets'}
                </CardTitle>
                <p className="text-gray-600">
                  {isFrench 
                    ? 'Chaque source de revenus compte, peu importe le montant. Soyez fiers de ce que vous avez !'
                    : 'Every source of income counts, regardless of the amount. Be proud of what you have!'
                  }
                </p>
                {/* Barre de progression */}
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      {isFrench ? 'Progression' : 'Progress'}
                    </span>
                    <span className="text-sm font-bold text-blue-600">
                      {getRevenusProgress()} %
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${getRevenusProgress()}%` }}
                    ></div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="salaire" className="text-gray-700">
                      {isFrench ? 'Salaire actuel' : 'Current salary'}
                    </Label>
                    <Input
                      id="salaire"
                      value={revenusData.salaire}
                      onChange={(e) => handleRevenusChange('salaire', e.target.value)}
                      placeholder={isFrench ? 'Salaire annuel ou mensuel' : 'Annual or monthly salary'}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="pensions" className="text-gray-700">
                      {isFrench ? 'Pensions gouvernementales' : 'Government pensions'}
                    </Label>
                    <Input
                      id="pensions"
                      value={revenusData.pensions}
                      onChange={(e) => handleRevenusChange('pensions', e.target.value)}
                      placeholder={isFrench ? 'CPP, RRQ, OAS, GIS...' : 'CPP, RRQ, OAS, GIS...'}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="epargne" className="text-gray-700">
                      {isFrench ? 'Épargne et investissements' : 'Savings and investments'}
                    </Label>
                    <Input
                      id="epargne"
                      value={revenusData.epargne}
                      onChange={(e) => handleRevenusChange('epargne', e.target.value)}
                      placeholder={isFrench ? 'REER, CELI, autres...' : 'RRSP, TFSA, others...'}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="immobilier" className="text-gray-700">
                      {isFrench ? 'Revenus immobiliers' : 'Real estate income'}
                    </Label>
                    <Input
                      id="immobilier"
                      value={revenusData.immobilier}
                      onChange={(e) => handleRevenusChange('immobilier', e.target.value)}
                      placeholder={isFrench ? 'Loyers, propriétés...' : 'Rent, properties...'}
                      className="mt-1"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="autres" className="text-gray-700">
                      {isFrench ? 'Autres sources de revenus' : 'Other sources of income'}
                    </Label>
                    <Textarea
                      id="autres"
                      value={revenusData.autres}
                      onChange={(e) => handleRevenusChange('autres', e.target.value)}
                      placeholder={isFrench ? 'Travail à temps partiel, passe-temps rémunérés...' : 'Part-time work, paid hobbies...'}
                      className="mt-1"
                      rows={2}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet 2 : Dépenses et budget */}
          <TabsContent value="depenses" className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border-2 border-green-200 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-green-800">
                  <CreditCard className="w-6 h-6" />
                  {isFrench ? 'Mes dépenses et budget' : 'My expenses and budget'}
                </CardTitle>
                <p className="text-gray-600">
                  {isFrench 
                    ? 'Planifiez avec vos moyens réels. Chaque dépense peut être optimisée sans sacrifier votre qualité de vie.'
                    : 'Plan with your real means. Every expense can be optimized without sacrificing your quality of life.'
                  }
                </p>
                {/* Barre de progression */}
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      {isFrench ? 'Progression' : 'Progress'}
                    </span>
                    <span className="text-sm font-bold text-green-600">
                      {getDepensesProgress()} %
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${getDepensesProgress()}%` }}
                    ></div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="logement" className="text-gray-700">
                      {isFrench ? 'Logement' : 'Housing'}
                    </Label>
                    <Input
                      id="logement"
                      value={depensesData.logement}
                      onChange={(e) => handleDepensesChange('logement', e.target.value)}
                      placeholder={isFrench ? 'Loyer, hypothèque, taxes...' : 'Rent, mortgage, taxes...'}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="alimentation" className="text-gray-700">
                      {isFrench ? 'Alimentation' : 'Food'}
                    </Label>
                    <Input
                      id="alimentation"
                      value={depensesData.alimentation}
                      onChange={(e) => handleDepensesChange('alimentation', e.target.value)}
                      placeholder={isFrench ? 'Épicerie, restaurants...' : 'Groceries, restaurants...'}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="transport" className="text-gray-700">
                      {isFrench ? 'Transport' : 'Transportation'}
                    </Label>
                    <Input
                      id="transport"
                      value={depensesData.transport}
                      onChange={(e) => handleDepensesChange('transport', e.target.value)}
                      placeholder={isFrench ? 'Voiture, transport en commun...' : 'Car, public transport...'}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="sante" className="text-gray-700">
                      {isFrench ? 'Santé' : 'Health'}
                    </Label>
                    <Input
                      id="sante"
                      value={depensesData.sante}
                      onChange={(e) => handleDepensesChange('sante', e.target.value)}
                      placeholder={isFrench ? 'Médicaments, soins...' : 'Medications, care...'}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="loisirs" className="text-gray-700">
                      {isFrench ? 'Loisirs' : 'Entertainment'}
                    </Label>
                    <Input
                      id="loisirs"
                      value={depensesData.loisirs}
                      onChange={(e) => handleDepensesChange('loisirs', e.target.value)}
                      placeholder={isFrench ? 'Sorties, hobbies...' : 'Outings, hobbies...'}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="autres" className="text-gray-700">
                      {isFrench ? 'Autres dépenses' : 'Other expenses'}
                    </Label>
                    <Input
                      id="autres"
                      value={depensesData.autres}
                      onChange={(e) => handleDepensesChange('autres', e.target.value)}
                      placeholder={isFrench ? 'Vêtements, services...' : 'Clothing, services...'}
                      className="mt-1"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet 3 : Calculs de retraite */}
          <TabsContent value="calculs" className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border-2 border-purple-200 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-purple-800">
                  <BarChart3 className="w-6 h-6" />
                  {isFrench ? 'Mes calculs de retraite' : 'My retirement calculations'}
                </CardTitle>
                <p className="text-gray-700">
                  {isFrench 
                    ? 'Votre retraite sera unique, comme vous. Ces calculs vous donnent une vision réaliste de votre avenir.'
                    : 'Your retirement will be unique, just like you. These calculations give you a realistic vision of your future.'
                  }
                </p>
                {/* Barre de progression */}
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      {isFrench ? 'Progression' : 'Progress'}
                    </span>
                    <span className="text-sm font-bold text-purple-600">
                      {getCalculsProgress()} %
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-purple-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${getCalculsProgress()}%` }}
                    ></div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="ageRetraite" className="text-gray-700">
                      {isFrench ? 'Âge souhaité de retraite' : 'Desired retirement age'}
                    </Label>
                    <Input
                      id="ageRetraite"
                      type="number"
                      value={calculsData.ageRetraite}
                      onChange={(e) => handleCalculsChange('ageRetraite', e.target.value)}
                      placeholder={isFrench ? 'Ex : 65 ans' : 'Ex: 65 years'}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="revenusMensuels" className="text-gray-700">
                      {isFrench ? 'Revenus mensuels projetés' : 'Projected monthly income'}
                    </Label>
                    <Input
                      id="revenusMensuels"
                      value={calculsData.revenusMensuels}
                      onChange={(e) => handleCalculsChange('revenusMensuels', e.target.value)}
                      placeholder={isFrench ? 'Montant en dollars' : 'Amount in dollars'}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="depensesMensuelles" className="text-gray-700">
                      {isFrench ? 'Dépenses mensuelles projetées' : 'Projected monthly expenses'}
                    </Label>
                    <Input
                      id="depensesMensuelles"
                      value={calculsData.depensesMensuelles}
                      onChange={(e) => handleCalculsChange('depensesMensuelles', e.target.value)}
                      placeholder={isFrench ? 'Montant en dollars' : 'Amount in dollars'}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="epargneNecessaire" className="text-gray-700">
                      {isFrench ? 'Épargne nécessaire' : 'Required savings'}
                    </Label>
                    <Input
                      id="epargneNecessaire"
                      value={calculsData.epargneNecessaire}
                      onChange={(e) => handleCalculsChange('epargneNecessaire', e.target.value)}
                      placeholder={isFrench ? 'Montant en dollars' : 'Amount in dollars'}
                      className="mt-1"
                    />
                  </div>
                </div>

                {/* Résumé encourageant */}
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg border border-purple-200 mt-6">
                  <div className="flex items-center gap-3 mb-2">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                    <h3 className="text-lg font-semibold text-purple-800">
                      {isFrench ? 'Votre plan prend forme !' : 'Your plan is taking shape!'}
                    </h3>
                  </div>
                  <p className="text-purple-700">
                    {isFrench 
                      ? 'Chaque information que vous ajoutez nous aide à créer un plan de retraite plus précis et personnalisé. Continuez, vous y êtes presque !'
                      : 'Every piece of information you add helps us create a more accurate and personalized retirement plan. Keep going, you\'re almost there!'
                    }
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Navigation et encouragement */}
        <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 mt-8">
          <CardContent className="py-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Star className="w-8 h-8 text-yellow-500" />
              <h2 className="text-2xl font-bold text-gray-800">
                {isFrench ? 'Excellent travail !' : 'Excellent work!'}
              </h2>
            </div>
            <p className="text-lg text-gray-700 mb-6">
              {isFrench 
                ? 'Vous construisez votre avenir financier étape par étape. Chaque détail compte pour créer un plan qui vous ressemble vraiment.'
                : 'You are building your financial future step by step. Every detail counts to create a plan that truly reflects you.'
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="outline"
                size="lg"
                onClick={() => handleNavigation('/mon-profil')}
                className="border-purple-600 text-purple-600 hover:bg-purple-50"
              >
                {isFrench ? 'Retour à mon profil' : 'Back to my profile'}
              </Button>
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                onClick={() => handleNavigation('/mes-resultats')}
              >
                {isFrench ? 'Voir mes résultats' : 'View my results'}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MaRetraite;
