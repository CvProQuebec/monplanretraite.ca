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
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">{t.cashflow.breakdownButton} : {title}</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Colonne de gauche - Total */}
          <div className="space-y-4">
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="pt-6">
                <div className="text-center space-y-2">
                  <p className="text-sm text-blue-600">{t.cashflow.currentTotal}</p>
                  <p className="text-3xl font-bold text-blue-800">{formatCurrency(total)}</p>
                  <p className="text-xs text-blue-600">{language === 'fr' ? 'Montant saisi manuellement' : 'Manually entered amount'}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-green-50 border-green-200">
              <CardContent className="pt-6">
                <div className="text-center space-y-2">
                  <p className="text-sm text-green-600">{language === 'fr' ? 'Total calculé' : 'Calculated Total'}</p>
                  <p className="text-3xl font-bold text-green-800">{formatCurrency(calculatedTotal)}</p>
                  <p className="text-xs text-green-600">{language === 'fr' ? 'Somme des sous-catégories' : 'Sum of subcategories'}</p>
                </div>
              </CardContent>
            </Card>

            {Math.abs(total - calculatedTotal) > 0.01 && (
              <Alert className="border-orange-200 bg-orange-50">
                <AlertCircle className="h-4 w-4 text-orange-600" />
                <AlertDescription className="text-orange-800 text-sm">
                  <strong>{language === 'fr' ? 'Différence détectée :' : 'Difference detected:'}</strong> {formatCurrency(Math.abs(total - calculatedTotal))}
                  <br />
                  {language === 'fr' 
                    ? 'Le total manuel et le total calculé ne correspondent pas.'
                    : 'The manual total and calculated total do not match.'
                  }
                </AlertDescription>
              </Alert>
            )}
          </div>

          {/* Colonne de droite - Détails */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">{language === 'fr' ? 'Sous-catégories' : 'Subcategories'}</h3>
            {categories.map((category) => (
              <div key={category.key} className="space-y-2">
                <Label className="flex items-center gap-2 text-sm font-medium">
                  {category.icon}
                  {category.label}
                </Label>
                <Input
                  type="number"
                  value={localBreakdown[category.key] || ''}
                  onChange={(e) => handleChange(category.key, parseFloat(e.target.value) || 0)}
                  placeholder="0"
                  className="text-lg p-3"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={handleCancel}>
            {t.cashflow.cancel}
          </Button>
          <Button onClick={handleSave}>
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
    <div className="space-y-6">
      {/* En-tête avec aide */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-sapphire-100 rounded-full flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-sapphire-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-charcoal-900">
              {t.cashflow.title}
            </h1>
            <p className="text-lg text-charcoal-600 mt-1">
              {t.cashflow.subtitle}
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowHelp(!showHelp)}
          className="bg-charcoal-100 hover:bg-charcoal-200 text-charcoal-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
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
            <TabsList className="grid w-full grid-cols-3 bg-gray-100 p-1 rounded-lg h-10">
              <TabsTrigger 
                value="depenses" 
                className="data-[state=active]:bg-red-500 data-[state=active]:text-white data-[state=active]:shadow-sm focus:outline-none focus:ring-0 px-3 py-1 text-sm font-medium"
              >
                {language === 'fr' ? 'Dépenses' : 'Expenses'}
              </TabsTrigger>
              <TabsTrigger 
                value="analyse"
                className="data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:shadow-sm focus:outline-none focus:ring-0 px-3 py-1 text-sm font-medium"
              >
                {language === 'fr' ? 'Analyse 50/30/20' : '50/30/20 Analysis'}
              </TabsTrigger>
              <TabsTrigger 
                value="optimisation"
                className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white data-[state=active]:shadow-sm focus:outline-none focus:ring-0 px-3 py-1 text-sm font-medium"
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
  );
};