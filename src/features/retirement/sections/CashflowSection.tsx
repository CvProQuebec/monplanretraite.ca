// src/features/retirement/sections/CashflowSection.tsx
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  TrendingUp, 
  DollarSign, 
  Home, 
  Zap, 
  Phone, 
  ShoppingCart, 
  Car, 
  Heart, 
  Gamepad2,
  Info,
  Calculator,
  PiggyBank,
  AlertCircle,
  CheckCircle,
  BarChart3,
  Shield,
  Plus,
  X,
  Settings
} from 'lucide-react';
import { UserData } from '../types';
import { formatCurrency } from '../utils/formatters';
import { useLanguage } from '../hooks/useLanguage';
import { translations } from '../translations/index';

interface CashflowSectionProps {
  data: UserData;
  onUpdate: (section: keyof UserData, updates: any) => void;
}

// Composant pour la ventilation des dépenses
interface ExpenseBreakdownProps {
  title: string;
  total: number;
  breakdown: Record<string, number>;
  onUpdate: (breakdown: Record<string, number>) => void;
  categories: { key: string; label: string; icon: React.ReactNode }[];
}

const ExpenseBreakdown: React.FC<ExpenseBreakdownProps> = ({ 
  title, 
  total, 
  breakdown, 
  onUpdate, 
  categories 
}) => {
  const { language } = useLanguage();
  const t = translations[language];
  const [isOpen, setIsOpen] = useState(false);
  const [localBreakdown, setLocalBreakdown] = useState(breakdown);

  const handleChange = (key: string, value: number) => {
    const newBreakdown = { ...localBreakdown, [key]: value };
    setLocalBreakdown(newBreakdown);
  };

  const handleSave = () => {
    onUpdate(localBreakdown);
    setIsOpen(false);
  };

  const handleCancel = () => {
    setLocalBreakdown(breakdown);
    setIsOpen(false);
  };

  const calculatedTotal = Object.values(localBreakdown).reduce((sum, value) => sum + (value || 0), 0);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="text-xs px-2 py-1 h-auto"
        >
          <Settings className="w-3 h-3 mr-1" />
          {t.cashflow.breakdownButton}
        </Button>
      </DialogTrigger>
             <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-white border-4 border-blue-300 shadow-2xl">
         <DialogHeader className="bg-blue-100 p-8 border-b-4 border-blue-400">
           <DialogTitle className="text-3xl font-bold text-blue-900 flex items-center gap-4">
             <Settings className="w-8 h-8 text-blue-700" />
             {t.cashflow.breakdownButton} : {title}
           </DialogTitle>
         </DialogHeader>
         
         <div className="p-8 space-y-8">
           {/* Section Totaux - Très Simple */}
           <div className="bg-gray-50 p-6 rounded-xl border-2 border-gray-300">
             <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
               {language === 'fr' ? 'Résumé des Totaux' : 'Total Summary'}
             </h3>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {/* Total Manuel */}
               <div className="bg-blue-100 p-6 rounded-lg border-2 border-blue-400 text-center">
                 <p className="text-xl font-bold text-blue-800 mb-2">
                   {language === 'fr' ? 'Total Manuel' : 'Manual Total'}
                 </p>
                 <p className="text-4xl font-bold text-blue-900 mb-2">
                   {formatCurrency(total)}
                 </p>
                 <p className="text-lg text-blue-700">
                   {language === 'fr' ? 'Montant saisi' : 'Entered amount'}
                 </p>
               </div>
               
               {/* Total Calculé */}
               <div className="bg-green-100 p-6 rounded-lg border-2 border-green-400 text-center">
                 <p className="text-xl font-bold text-green-800 mb-2">
                   {language === 'fr' ? 'Total Calculé' : 'Calculated Total'}
                 </p>
                 <p className="text-4xl font-bold text-green-900 mb-2">
                   {formatCurrency(calculatedTotal)}
                 </p>
                 <p className="text-lg text-green-700">
                   {language === 'fr' ? 'Somme des détails' : 'Sum of details'}
                 </p>
               </div>
             </div>
             
             {/* Alerte de différence - Très visible */}
             {Math.abs(total - calculatedTotal) > 0.01 && (
               <div className="mt-6 p-4 bg-orange-100 border-4 border-orange-400 rounded-lg">
                 <div className="flex items-center gap-3">
                   <AlertCircle className="w-8 h-8 text-orange-700" />
                   <div>
                     <p className="text-xl font-bold text-orange-800">
                       {language === 'fr' ? '⚠️ ATTENTION : Différence détectée' : '⚠️ WARNING: Difference detected'}
                     </p>
                     <p className="text-lg text-orange-700">
                       {formatCurrency(Math.abs(total - calculatedTotal))}
                     </p>
                   </div>
                 </div>
               </div>
             )}
           </div>

                       {/* Section Détails - Ultra-Simple en 2 Colonnes */}
            <div className="bg-white border-2 border-gray-300 rounded-xl p-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <Settings className="w-6 h-6 text-blue-600" />
                {language === 'fr' ? 'Détails par Catégorie' : 'Category Details'}
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                {categories.map((category) => (
                  <div key={category.key} className="border-2 border-gray-200 rounded-lg p-4 bg-gray-50">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-7 h-7 flex items-center justify-center bg-blue-100 rounded-full">
                        {category.icon}
                      </div>
                      <Label className="text-lg font-bold text-gray-800">
                        {category.label}
                      </Label>
                    </div>
                    <Input
                      type="number"
                      value={localBreakdown[category.key] || ''}
                      onChange={(e) => handleChange(category.key, parseFloat(e.target.value) || 0)}
                      placeholder="0"
                      className="text-xl p-3 border-2 border-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-200 transition-all duration-200"
                    />
                  </div>
                ))}
              </div>
            </div>
         </div>

         {/* Boutons d'Action - Très Visibles */}
         <div className="flex justify-center gap-6 pt-8 pb-6 bg-gray-100 border-t-4 border-gray-300">
           <Button 
             variant="outline" 
             onClick={handleCancel}
             className="px-8 py-4 text-xl font-bold border-4 border-gray-500 hover:border-gray-700 hover:bg-gray-200 transition-all duration-200"
           >
             <X className="w-6 h-6 mr-3" />
             {t.cashflow.cancel}
           </Button>
           <Button 
             onClick={handleSave}
             className="px-8 py-4 text-xl font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 border-4 border-blue-500"
           >
             <CheckCircle className="w-6 h-6 mr-3" />
             {t.cashflow.save}
           </Button>
         </div>
      </DialogContent>
    </Dialog>
  );
};

export const CashflowSection: React.FC<CashflowSectionProps> = ({ data, onUpdate }) => {
  const { language } = useLanguage();
  const t = translations[language];
  const [activeTab, setActiveTab] = useState('depenses');
  const [showHelp, setShowHelp] = useState(false);

  const handleChange = (field: string, value: any) => {
    onUpdate('cashflow', { [field]: value });
  };

  const handleBreakdownUpdate = (category: string, breakdown: Record<string, number>) => {
    const total = Object.values(breakdown).reduce((sum, value) => sum + (value || 0), 0);
    onUpdate('cashflow', { 
      [category]: total,
      [`${category}Breakdown`]: breakdown 
    });
  };

  // Calculs pour le flux de trésorerie
  const totalDepenses = (data.cashflow.logement || 0) + 
                       (data.cashflow.servicesPublics || 0) + 
                       (data.cashflow.assurances || 0) + 
                       (data.cashflow.telecom || 0) + 
                       (data.cashflow.alimentation || 0) + 
                       (data.cashflow.transport || 0) + 
                       (data.cashflow.sante || 0) + 
                       (data.cashflow.loisirs || 0);

  const revenusMensuels = (data.personal.salaire1 || 0) / 12 + (data.personal.salaire2 || 0) / 12;
  const surplusDeficit = revenusMensuels - totalDepenses;
  const tauxEpargne = revenusMensuels > 0 ? (surplusDeficit / revenusMensuels) * 100 : 0;

  // Objectifs de dépenses (règles du 50/30/20)
  const depensesEssentielles = (data.cashflow.logement || 0) + (data.cashflow.servicesPublics || 0) + 
                              (data.cashflow.assurances || 0) + (data.cashflow.alimentation || 0) + 
                              (data.cashflow.transport || 0) + (data.cashflow.sante || 0);
  const depensesDiscretionnaires = (data.cashflow.telecom || 0) + (data.cashflow.loisirs || 0);

  const ratioEssentiels = revenusMensuels > 0 ? (depensesEssentielles / revenusMensuels) * 100 : 0;
  const ratioDiscretionnaires = revenusMensuels > 0 ? (depensesDiscretionnaires / revenusMensuels) * 100 : 0;
  const ratioEpargne = revenusMensuels > 0 ? (surplusDeficit / revenusMensuels) * 100 : 0;

  // Définitions des sous-catégories
  const santeCategories = [
    { key: 'medecinePrivee', label: language === 'fr' ? 'Médecine privée' : 'Private Medicine', icon: <Heart className="w-4 h-4 text-red-500" /> },
    { key: 'medicaments', label: language === 'fr' ? 'Prescription/Médicaments' : 'Prescription/Medications', icon: <Heart className="w-4 h-4 text-red-500" /> },
    { key: 'dentiste', label: language === 'fr' ? 'Dentiste' : 'Dentist', icon: <Heart className="w-4 h-4 text-red-500" /> },
    { key: 'lunettes', label: language === 'fr' ? 'Lunettes' : 'Glasses', icon: <Heart className="w-4 h-4 text-red-500" /> },
    { key: 'autresSoins', label: language === 'fr' ? 'Autres soins' : 'Other Care', icon: <Heart className="w-4 h-4 text-red-500" /> }
  ];

  const transportCategories = [
    { key: 'location', label: language === 'fr' ? 'Location' : 'Rental', icon: <Car className="w-4 h-4 text-red-500" /> },
    { key: 'essence', label: language === 'fr' ? 'Essence' : 'Gasoline', icon: <Car className="w-4 h-4 text-red-500" /> },
    { key: 'maintenance', label: language === 'fr' ? 'Maintenance' : 'Maintenance', icon: <Car className="w-4 h-4 text-red-500" /> },
    { key: 'reparation', label: language === 'fr' ? 'Réparation' : 'Repairs', icon: <Car className="w-4 h-4 text-red-500" /> },
    { key: 'transportCommun', label: language === 'fr' ? 'Transport en commun' : 'Public Transport', icon: <Car className="w-4 h-4 text-red-500" /> }
  ];

  const telecomCategories = [
    { key: 'internet', label: language === 'fr' ? 'Internet' : 'Internet', icon: <Phone className="w-4 h-4 text-orange-500" /> },
    { key: 'telephone', label: language === 'fr' ? 'Téléphone fixe' : 'Landline Phone', icon: <Phone className="w-4 h-4 text-orange-500" /> },
    { key: 'cellulaire', label: language === 'fr' ? 'Cellulaire' : 'Mobile Phone', icon: <Phone className="w-4 h-4 text-orange-500" /> },
    { key: 'tv', label: language === 'fr' ? 'Télévision' : 'Television', icon: <Phone className="w-4 h-4 text-orange-500" /> },
    { key: 'streaming', label: language === 'fr' ? 'Services de streaming' : 'Streaming Services', icon: <Phone className="w-4 h-4 text-orange-500" /> }
  ];

  const logementCategories = [
    { key: 'loyer', label: language === 'fr' ? 'Loyer' : 'Rent', icon: <Home className="w-4 h-4 text-red-500" /> },
    { key: 'hypotheque', label: language === 'fr' ? 'Hypothèque' : 'Mortgage', icon: <Home className="w-4 h-4 text-red-500" /> },
    { key: 'taxesMunicipales', label: language === 'fr' ? 'Taxes municipales' : 'Municipal Taxes', icon: <Home className="w-4 h-4 text-red-500" /> },
    { key: 'assuranceHabitation', label: language === 'fr' ? 'Assurance habitation' : 'Home Insurance', icon: <Home className="w-4 h-4 text-red-500" /> },
    { key: 'entretien', label: language === 'fr' ? 'Entretien' : 'Maintenance', icon: <Home className="w-4 h-4 text-red-500" /> }
  ];

  const servicesPublicsCategories = [
    { key: 'electricite', label: language === 'fr' ? 'Électricité' : 'Electricity', icon: <Zap className="w-4 h-4 text-red-500" /> },
    { key: 'eau', label: language === 'fr' ? 'Eau' : 'Water', icon: <Zap className="w-4 h-4 text-red-500" /> },
    { key: 'gazNaturel', label: language === 'fr' ? 'Gaz naturel' : 'Natural Gas', icon: <Zap className="w-4 h-4 text-red-500" /> },
    { key: 'chauffage', label: language === 'fr' ? 'Chauffage' : 'Heating', icon: <Zap className="w-4 h-4 text-red-500" /> },
    { key: 'dechets', label: language === 'fr' ? 'Collecte des déchets' : 'Waste Collection', icon: <Zap className="w-4 h-4 text-red-500" /> }
  ];

  const assurancesCategories = [
    { key: 'habitation', label: language === 'fr' ? 'Assurance habitation' : 'Home Insurance', icon: <Shield className="w-4 h-4 text-red-500" /> },
    { key: 'auto', label: language === 'fr' ? 'Assurance auto' : 'Auto Insurance', icon: <Shield className="w-4 h-4 text-red-500" /> },
    { key: 'vie', label: language === 'fr' ? 'Assurance vie' : 'Life Insurance', icon: <Shield className="w-4 h-4 text-red-500" /> },
    { key: 'invalidite', label: language === 'fr' ? 'Assurance invalidité' : 'Disability Insurance', icon: <Shield className="w-4 h-4 text-red-500" /> },
    { key: 'maladie', label: language === 'fr' ? 'Assurance maladie' : 'Health Insurance', icon: <Shield className="w-4 h-4 text-red-500" /> }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 text-white">
      {/* Particules de fond visibles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-3 h-3 bg-blue-400 rounded-full animate-bounce"></div>
        <div className="absolute top-60 left-1/4 w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
        <div className="absolute top-80 right-1/3 w-1 h-1 bg-red-400 rounded-full animate-pulse"></div>
        <div className="absolute top-96 left-1/2 w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
        <div className="absolute top-32 right-1/4 w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
        <div className="absolute top-72 left-1/3 w-1 h-1 bg-pink-400 rounded-full animate-bounce"></div>
      </div>

      <div className="container mx-auto px-6 py-8 relative z-10">
        <div className="space-y-6">
          {/* En-tête avec aide - Style Phase 2 */}
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-yellow-400 via-orange-400 to-red-500 bg-clip-text text-transparent drop-shadow-2xl mb-4">
              {t.cashflow.title}
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              {t.cashflow.subtitle}
            </p>
            <button
              onClick={() => setShowHelp(!showHelp)}
              className="mt-4 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors backdrop-blur-sm border border-white/20"
            >
              <Info className="w-4 h-4 inline mr-2" />
              {t.personalData.help}
            </button>
          </div>

      {/* Message d'aide */}
      {showHelp && (
        <Alert className="border-sapphire-200 bg-sapphire-50">
          <Info className="h-5 w-5 text-sapphire-600" />
          <AlertDescription className="text-sapphire-800">
            <strong>Gestion du flux de trésorerie :</strong> Suivez vos dépenses mensuelles pour identifier les opportunités d'épargne. 
            La règle du 50/30/20 recommande 50 % pour les besoins essentiels, 30 % pour les désirs, et 20 % pour l'épargne.
            <br /><br />
            <strong>Ventilation des dépenses :</strong> Utilisez le bouton "Ventiler" pour détailler chaque catégorie de dépenses en sous-catégories.
          </AlertDescription>
        </Alert>
      )}

      {/* Métriques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm text-gray-600">{t.cashflow.monthlyIncome}</p>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(revenusMensuels)}</p>
              <p className="text-xs text-gray-500">{language === 'fr' ? 'Salaire net des deux personnes' : 'Net salary of both persons'}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm text-gray-600">{language === 'fr' ? 'Dépenses mensuelles' : 'Monthly Expenses'}</p>
              <p className="text-2xl font-bold text-red-600">{formatCurrency(totalDepenses)}</p>
              <p className="text-xs text-gray-500">{language === 'fr' ? 'Total de toutes les dépenses' : 'Total of all expenses'}</p>
            </div>
          </CardContent>
        </Card>

        <Card className={`border-l-4 ${surplusDeficit >= 0 ? 'border-l-emerald-500' : 'border-l-orange-500'}`}>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm text-gray-600">{language === 'fr' ? 'Surplus/Déficit' : 'Surplus/Deficit'}</p>
              <p className={`text-2xl font-bold ${surplusDeficit >= 0 ? 'text-emerald-600' : 'text-orange-600'}`}>
                {surplusDeficit >= 0 ? '+' : ''}{formatCurrency(surplusDeficit)}
              </p>
              <p className="text-xs text-gray-500">{surplusDeficit >= 0 ? (language === 'fr' ? 'Épargne disponible' : 'Available savings') : (language === 'fr' ? 'Déficit à combler' : 'Deficit to cover')}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm text-gray-600">{language === 'fr' ? 'Taux d\'épargne' : 'Savings Rate'}</p>
              <div className="flex items-center gap-2">
                <Progress value={Math.max(0, tauxEpargne)} className="flex-1 h-2" />
                <span className="text-sm font-semibold">{tauxEpargne.toFixed(1)}%</span>
              </div>
                              <p className="text-xs text-gray-500">{language === 'fr' ? 'Objectif : 20 %' : 'Goal: 20%'}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Navigation par onglets */}
      <Card>
        <CardContent className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
                         <TabsList className="grid w-full grid-cols-3 bg-white p-2 rounded-xl h-14 border-2 border-gray-300 shadow-lg">
               <TabsTrigger 
                 value="depenses" 
                 className="data-[state=active]:bg-red-500 data-[state=active]:text-white data-[state=active]:shadow-lg focus:outline-none focus:ring-4 focus:ring-red-200 px-4 py-2 text-lg font-bold rounded-lg transition-all duration-200 data-[state=inactive]:bg-gray-100 data-[state=inactive]:text-gray-700 data-[state=inactive]:hover:bg-gray-200"
               >
                 {language === 'fr' ? 'Dépenses' : 'Expenses'}
               </TabsTrigger>
               <TabsTrigger 
                 value="analyse"
                 className="data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-200 px-4 py-2 text-lg font-bold rounded-lg transition-all duration-200 data-[state=inactive]:bg-gray-100 data-[state=inactive]:text-gray-700 data-[state=inactive]:hover:bg-gray-200"
               >
                 {language === 'fr' ? 'Analyse 50/30/20' : '50/30/20 Analysis'}
               </TabsTrigger>
               <TabsTrigger 
                 value="optimisation"
                 className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white data-[state=active]:shadow-lg focus:outline-none focus:ring-4 focus:ring-emerald-200 px-4 py-2 text-lg font-bold rounded-lg transition-all duration-200 data-[state=inactive]:bg-gray-100 data-[state=inactive]:text-gray-700 data-[state=inactive]:hover:bg-gray-200"
               >
                 {language === 'fr' ? 'Optimisation' : 'Optimization'}
               </TabsTrigger>
             </TabsList>

            {/* Onglet Dépenses */}
            <TabsContent value="depenses" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Dépenses essentielles */}
                <Card className="border-l-4 border-l-red-500">
                  <CardHeader>
                    <CardTitle className="text-lg text-red-700">{t.cashflow.essentialExpenses}</CardTitle>
                    <CardDescription>{t.cashflow.basicNecessities}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="flex items-center gap-2">
                          <Home className="w-4 h-4 text-red-500" />
                          {language === 'fr' ? 'Logement (loyer/hypothèque)' : 'Housing (rent/mortgage)'}
                        </Label>
                        <ExpenseBreakdown
                          title={language === 'fr' ? 'Logement' : 'Housing'}
                          total={data.cashflow.logement || 0}
                          breakdown={data.cashflow.logementBreakdown || {}}
                          onUpdate={(breakdown) => handleBreakdownUpdate('logement', breakdown)}
                          categories={logementCategories}
                        />
                      </div>
                      <Input
                        type="number"
                        value={data.cashflow.logement || ''}
                        onChange={(e) => handleChange('logement', parseFloat(e.target.value) || 0)}
                        placeholder="0"
                        className="text-lg p-3"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="flex items-center gap-2">
                          <Zap className="w-4 h-4 text-red-500" />
                          {language === 'fr' ? 'Services publics (électricité, eau, etc.)' : 'Utilities (electricity, water, etc.)'}
                        </Label>
                        <ExpenseBreakdown
                          title={language === 'fr' ? 'Services publics' : 'Utilities'}
                          total={data.cashflow.servicesPublics || 0}
                          breakdown={data.cashflow.servicesPublicsBreakdown || {}}
                          onUpdate={(breakdown) => handleBreakdownUpdate('servicesPublics', breakdown)}
                          categories={servicesPublicsCategories}
                        />
                      </div>
                      <Input
                        type="number"
                        value={data.cashflow.servicesPublics || ''}
                        onChange={(e) => handleChange('servicesPublics', parseFloat(e.target.value) || 0)}
                        placeholder="0"
                        className="text-lg p-3"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="flex items-center gap-2">
                          <Shield className="w-4 h-4 text-red-500" />
                          {language === 'fr' ? 'Assurances (habitation, auto, vie)' : 'Insurance (home, auto, life)'}
                        </Label>
                        <ExpenseBreakdown
                          title={language === 'fr' ? 'Assurances' : 'Insurance'}
                          total={data.cashflow.assurances || 0}
                          breakdown={data.cashflow.assurancesBreakdown || {}}
                          onUpdate={(breakdown) => handleBreakdownUpdate('assurances', breakdown)}
                          categories={assurancesCategories}
                        />
                      </div>
                      <Input
                        type="number"
                        value={data.cashflow.assurances || ''}
                        onChange={(e) => handleChange('assurances', parseFloat(e.target.value) || 0)}
                        placeholder="0"
                        className="text-lg p-3"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <ShoppingCart className="w-4 h-4 text-red-500" />
                        {language === 'fr' ? 'Alimentation et produits de base' : 'Food and basic products'}
                      </Label>
                      <Input
                        type="number"
                        value={data.cashflow.alimentation || ''}
                        onChange={(e) => handleChange('alimentation', parseFloat(e.target.value) || 0)}
                        placeholder="0"
                        className="text-lg p-3"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="flex items-center gap-2">
                          <Car className="w-4 h-4 text-red-500" />
                          {language === 'fr' ? 'Transport (essence, transport en commun)' : 'Transportation (gas, public transit)'}
                        </Label>
                        <ExpenseBreakdown
                          title={language === 'fr' ? 'Transport' : 'Transportation'}
                          total={data.cashflow.transport || 0}
                          breakdown={data.cashflow.transportBreakdown || {}}
                          onUpdate={(breakdown) => handleBreakdownUpdate('transport', breakdown)}
                          categories={transportCategories}
                        />
                      </div>
                      <Input
                        type="number"
                        value={data.cashflow.transport || ''}
                        onChange={(e) => handleChange('transport', parseFloat(e.target.value) || 0)}
                        placeholder="0"
                        className="text-lg p-3"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="flex items-center gap-2">
                          <Heart className="w-4 h-4 text-red-500" />
                          {language === 'fr' ? 'Santé (médicaments, soins)' : 'Health (medications, care)'}
                        </Label>
                        <ExpenseBreakdown
                          title={language === 'fr' ? 'Santé' : 'Health'}
                          total={data.cashflow.sante || 0}
                          breakdown={data.cashflow.santeBreakdown || {}}
                          onUpdate={(breakdown) => handleBreakdownUpdate('sante', breakdown)}
                          categories={santeCategories}
                        />
                      </div>
                      <Input
                        type="number"
                        value={data.cashflow.sante || ''}
                        onChange={(e) => handleChange('sante', parseFloat(e.target.value) || 0)}
                        placeholder="0"
                        className="text-lg p-3"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Dépenses discrétionnaires */}
                <Card className="border-l-4 border-l-orange-500">
                  <CardHeader>
                    <CardTitle className="text-lg text-orange-700">{t.cashflow.discretionaryExpenses}</CardTitle>
                    <CardDescription>{t.cashflow.wantsAndLeisure}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-orange-500" />
                          {language === 'fr' ? 'Télécommunications (téléphone, internet, TV)' : 'Telecommunications (phone, internet, TV)'}
                        </Label>
                        <ExpenseBreakdown
                          title={language === 'fr' ? 'Télécommunications' : 'Telecommunications'}
                          total={data.cashflow.telecom || 0}
                          breakdown={data.cashflow.telecomBreakdown || {}}
                          onUpdate={(breakdown) => handleBreakdownUpdate('telecom', breakdown)}
                          categories={telecomCategories}
                        />
                      </div>
                      <Input
                        type="number"
                        value={data.cashflow.telecom || ''}
                        onChange={(e) => handleChange('telecom', parseFloat(e.target.value) || 0)}
                        placeholder="0"
                        className="text-lg p-3"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Gamepad2 className="w-4 h-4 text-orange-500" />
                        {language === 'fr' ? 'Loisirs et divertissements' : 'Leisure and entertainment'}
                      </Label>
                      <Input
                        type="number"
                        value={data.cashflow.loisirs || ''}
                        onChange={(e) => handleChange('loisirs', parseFloat(e.target.value) || 0)}
                        placeholder="0"
                        className="text-lg p-3"
                      />
                      <p className="text-xs text-gray-600">Restaurants, sorties, hobbies, etc.</p>
                    </div>

                    {/* Résumé des dépenses */}
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-semibold mb-3">{t.cashflow.expenseSummary}</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>{t.cashflow.essential}</span>
                          <span className="font-semibold text-red-600">{formatCurrency(depensesEssentielles)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>{t.cashflow.discretionary}</span>
                          <span className="font-semibold text-orange-600">{formatCurrency(depensesDiscretionnaires)}</span>
                        </div>
                        <div className="border-t pt-2">
                          <div className="flex justify-between font-bold">
                            <span>{t.cashflow.total}:</span>
                            <span className="text-charcoal-600">{formatCurrency(totalDepenses)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Onglet Analyse 50/30/20 */}
            <TabsContent value="analyse" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Graphique de répartition */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{t.cashflow.rule503020Breakdown}</CardTitle>
                    <CardDescription>{t.cashflow.expenseAnalysisCategory}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Besoins essentiels (50 %) */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-red-500 rounded"></div>
                          {t.cashflow.essentialNeeds50}
                        </span>
                        <span className="font-semibold">{ratioEssentiels.toFixed(1)}%</span>
                      </div>
                      <Progress 
                        value={Math.min(100, ratioEssentiels)} 
                        className="h-3"
                        style={{ backgroundColor: '#fecaca' }}
                      />
                      <p className="text-xs text-gray-600">{formatCurrency(depensesEssentielles)} / {formatCurrency(revenusMensuels)}</p>
                    </div>

                    {/* Désirs (30 %) */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                         <span className="flex items-center gap-2">
                           <div className="w-3 h-3 bg-orange-500 rounded"></div>
                           {t.cashflow.wants30}
                         </span>
                        <span className="font-semibold">{ratioDiscretionnaires.toFixed(1)}%</span>
                      </div>
                      <Progress 
                        value={Math.min(100, ratioDiscretionnaires)} 
                        className="h-3"
                        style={{ backgroundColor: '#fed7aa' }}
                      />
                      <p className="text-xs text-gray-600">{formatCurrency(depensesDiscretionnaires)} / {formatCurrency(revenusMensuels)}</p>
                    </div>

                    {/* Épargne (20 %) */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="flex items-center gap-2">
                           <div className="w-3 h-3 bg-emerald-500 rounded"></div>
                           {t.cashflow.savings20}
                        </span>
                        <span className="font-semibold">{ratioEpargne.toFixed(1)}%</span>
                      </div>
                      <Progress 
                        value={Math.min(100, ratioEpargne)} 
                        className="h-3"
                        style={{ backgroundColor: '#bbf7d0' }}
                      />
                      <p className="text-xs text-gray-600">{formatCurrency(surplusDeficit)} / {formatCurrency(revenusMensuels)}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Évaluation et conseils */}
                <Card className="bg-blue-50 border-blue-200">
                  <CardHeader>
                    <CardTitle className="text-lg text-blue-800">{t.cashflow.budgetEvaluation}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 text-blue-700">
                    {ratioEssentiels > 60 && (
                      <div className="flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 mt-0.5 text-red-500" />
                        <p className="text-sm">
                          <strong>Dépenses essentielles élevées :</strong> Vos besoins essentiels représentent {ratioEssentiels.toFixed(1)}% de vos revenus. 
                          Considérez réduire les coûts de logement ou de transport.
                        </p>
                      </div>
                    )}

                    {ratioDiscretionnaires > 40 && (
                      <div className="flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 mt-0.5 text-orange-500" />
                        <p className="text-sm">
                          <strong>Dépenses discrétionnaires élevées :</strong> Vos désirs représentent {ratioDiscretionnaires.toFixed(1)}% de vos revenus. 
                          Réduisez les loisirs pour augmenter l'épargne.
                        </p>
                      </div>
                    )}

                    {ratioEpargne < 15 && (
                      <div className="flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 mt-0.5 text-red-500" />
                        <p className="text-sm">
                          <strong>Épargne insuffisante :</strong> {t.cashFlowEvaluation.insufficientSavings}
                        </p>
                      </div>
                    )}

                    {ratioEssentiels <= 50 && ratioDiscretionnaires <= 30 && ratioEpargne >= 20 && (
                      <div className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 mt-0.5 text-green-500" />
                        <p className="text-sm">
                          <strong>Budget équilibré :</strong> Félicitations ! Votre budget respecte la règle 50/30/20. 
                          Continuez sur cette voie pour une retraite confortable.
                        </p>
                      </div>
                    )}

                    <div className="mt-4 p-3 bg-blue-100 rounded-lg">
                      <p className="text-sm font-medium">
                        💡 <strong>Conseil :</strong> L'objectif est d'épargner au moins 20 % de vos revenus pour assurer une retraite confortable.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Onglet Optimisation */}
            <TabsContent value="optimisation" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Opportunités d'économie */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{t.cashflow.savingsOpportunities}</CardTitle>
                    <CardDescription>{t.cashflow.suggestionsToReduce}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {data.cashflow.logement > revenusMensuels * 0.3 && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                        <h4 className="font-semibold text-red-800 mb-2">🏠 Logement</h4>
                        <p className="text-sm text-red-700">
                          Votre logement représente {(data.cashflow.logement / revenusMensuels * 100).toFixed(1)}% de vos revenus. 
                          Considérez déménager ou refinancer votre hypothèque.
                        </p>
                      </div>
                    )}

                    {data.cashflow.telecom > 200 && (
                      <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                        <h4 className="font-semibold text-orange-800 mb-2">📱 Télécommunications</h4>
                        <p className="text-sm text-orange-700">
                          Vos frais de télécom ({formatCurrency(data.cashflow.telecom)}) sont élevés. 
                          Comparez les forfaits et négociez avec votre fournisseur.
                        </p>
                      </div>
                    )}

                    {data.cashflow.loisirs > revenusMensuels * 0.15 && (
                      <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <h4 className="font-semibold text-yellow-800 mb-2">🎮 Loisirs</h4>
                        <p className="text-sm text-yellow-700">
                          Vos loisirs représentent {(data.cashflow.loisirs / revenusMensuels * 100).toFixed(1)}% de vos revenus. 
                          Réduisez temporairement pour augmenter l'épargne.
                        </p>
                      </div>
                    )}

                    {surplusDeficit < 0 && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                        <h4 className="font-semibold text-red-800 mb-2">⚠️ Déficit mensuel</h4>
                        <p className="text-sm text-red-700">
                          Vous dépensez {formatCurrency(Math.abs(surplusDeficit))} de plus que vos revenus. 
                          Priorisez la réduction des dépenses discrétionnaires.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Plan d'action */}
                <Card className="bg-emerald-50 border-emerald-200">
                  <CardHeader>
                    <CardTitle className="text-lg text-emerald-800">{t.cashflow.recommendedActionPlan}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 text-emerald-700">
                    <div className="space-y-3">
                      <h4 className="font-semibold">{t.cashflow.priority1}</h4>
                      <ul className="text-sm space-y-2">
                        <li>• {t.cashflow.reduceDiscretionary}</li>
                        <li>• {t.cashflow.negotiateFees}</li>
                        <li>• {t.cashflow.optimizeTransport}</li>
                      </ul>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-semibold">{t.cashflow.priority2}</h4>
                      <ul className="text-sm space-y-2">
                        <li>• {t.cashflow.automateContributions}</li>
                        <li>• {t.cashflow.saveEndMonth}</li>
                        <li>• {t.cashflow.use503020Rule}</li>
                      </ul>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-semibold">{t.cashflow.priority3}</h4>
                      <ul className="text-sm space-y-2">
                        <li>• {t.cashflow.requestSalaryIncrease}</li>
                        <li>• {t.cashflow.additionalIncome}</li>
                        <li>• {t.cashflow.optimizeTaxDeductions}</li>
                      </ul>
                    </div>

                    <div className="mt-4 p-3 bg-emerald-100 rounded-lg">
                      <p className="text-sm font-medium">
                        🎯 <strong>{language === 'fr' ? 'Objectif :' : 'Goal:'}</strong> {t.cashflow.savingsGoal}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
        </div>
      </div>
    </div>
  );
};
