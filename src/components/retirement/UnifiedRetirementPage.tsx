import React, { useState } from 'react';
import { useLanguage } from '@/features/retirement/hooks/useLanguage';
import { 
  DollarSign, 
  Home, 
  Car, 
  Heart, 
  Utensils, 
  Zap, 
  Phone, 
  Briefcase,
  PiggyBank,
  Building,
  Flag,
  Calculator,
  TrendingUp,
  Calendar,
  ChevronRight,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';
import SimpleIncomeTable from '@/components/ui/SimpleIncomeTable';

interface SectionProgress {
  id: string;
  completed: boolean;
  progress: number;
}

export const UnifiedRetirementPage: React.FC = () => {
  const { language } = useLanguage();
  const [activeSection, setActiveSection] = useState<'revenus' | 'depenses' | 'calculs'>('revenus');
  const [sectionProgress, setSectionProgress] = useState<SectionProgress[]>([
    { id: 'revenus', completed: true, progress: 100 },
    { id: 'depenses', completed: false, progress: 60 },
    { id: 'calculs', completed: false, progress: 0 }
  ]);

  const sections = [
    {
      id: 'revenus' as const,
      title: language === 'fr' ? 'MES REVENUS ET ACTIFS' : 'MY INCOME AND ASSETS',
      icon: '🏦',
      description: language === 'fr' ? 'Tout l\'argent qui rentre' : 'All money coming in'
    },
    {
      id: 'depenses' as const,
      title: language === 'fr' ? 'MES DÉPENSES ET BUDGET' : 'MY EXPENSES AND BUDGET',
      icon: '💳',
      description: language === 'fr' ? 'Tout l\'argent qui sort' : 'All money going out'
    },
    {
      id: 'calculs' as const,
      title: language === 'fr' ? 'MES CALCULS DE RETRAITE' : 'MY RETIREMENT CALCULATIONS',
      icon: '📊',
      description: language === 'fr' ? 'Résultats et projections' : 'Results and projections'
    }
  ];

  const getSectionStatus = (sectionId: string) => {
    const section = sectionProgress.find(s => s.id === sectionId);
    if (!section) return { status: 'pending', icon: Clock, color: 'gray' };
    
    if (section.completed) return { status: 'completed', icon: CheckCircle, color: 'green' };
    if (section.progress > 0) return { status: 'in-progress', icon: Clock, color: 'blue' };
    return { status: 'pending', icon: AlertCircle, color: 'gray' };
  };

  const renderRevenuSection = () => (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          🏦 {language === 'fr' ? 'MES REVENUS ET ACTIFS' : 'MY INCOME AND ASSETS'}
        </h2>
        <p className="text-xl text-gray-700">
          {language === 'fr' 
            ? 'Regroupons toutes vos sources de revenus au même endroit'
            : 'Let\'s group all your income sources in one place'
          }
        </p>
      </div>

      {/* Tableau des revenus (saisie simplifiée et complète) */}
      <div className="bg-white rounded-xl border-2 border-gray-200 p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-mpr-interactive-lt rounded-lg">
            <Briefcase className="w-6 h-6 text-mpr-interactive" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">
              {language === 'fr' ? "Tableau des revenus" : 'Income table'}
            </h3>
            <p className="text-gray-600">
              {language === 'fr' ? 'Type, Description, Montant, Fréquence, Date de début, Date de fin' : 'Type, Description, Amount, Frequency, Start, End'}
            </p>
          </div>
        </div>
        {/* Intégration du composant dédié */}
        <SimpleIncomeTable />
      </div>

      {/* Revenus d'emploi (exemple guidé) */}
      <div className="bg-white rounded-xl border-2 border-gray-200 p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-mpr-interactive-lt rounded-lg">
            <Briefcase className="w-6 h-6 text-mpr-interactive" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">
              {language === 'fr' ? 'Revenus d\'emploi actuels' : 'Current employment income'}
            </h3>
            <p className="text-gray-600">
              {language === 'fr' ? 'Votre salaire et avantages' : 'Your salary and benefits'}
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-lg font-medium text-gray-900 mb-2">
              {language === 'fr' ? 'Salaire annuel brut' : 'Annual gross salary'}
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="number"
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg text-lg focus:border-mpr-interactive focus:outline-none"
                placeholder="65,000"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-lg font-medium text-gray-900 mb-2">
              {language === 'fr' ? 'Régime de pension d\'employeur' : 'Employer pension plan'}
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="number"
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg text-lg focus:border-mpr-interactive focus:outline-none"
                placeholder="1,200"
              />
            </div>
            <p className="text-sm text-gray-600 mt-1">
              {language === 'fr' ? 'Montant mensuel estimé' : 'Estimated monthly amount'}
            </p>
          </div>
        </div>
      </div>

      {/* Épargne et investissements */}
      <div className="bg-white rounded-xl border-2 border-gray-200 p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-green-100 rounded-lg">
            <PiggyBank className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">
              {language === 'fr' ? 'Épargne et investissements' : 'Savings and investments'}
            </h3>
            <p className="text-gray-600">
              {language === 'fr' ? 'REER, CELI et autres placements' : 'RRSP, TFSA and other investments'}
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-lg font-medium text-gray-900 mb-2">REER</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="number"
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg text-lg focus:border-mpr-interactive focus:outline-none"
                placeholder="125,000"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-lg font-medium text-gray-900 mb-2">CELI</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="number"
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg text-lg focus:border-mpr-interactive focus:outline-none"
                placeholder="45,000"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-lg font-medium text-gray-900 mb-2">
              {language === 'fr' ? 'Autres épargnes' : 'Other savings'}
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="number"
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg text-lg focus:border-mpr-interactive focus:outline-none"
                placeholder="25,000"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Immobilier */}
      <div className="bg-white rounded-xl border-2 border-gray-200 p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-purple-100 rounded-lg">
            <Building className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">
              {language === 'fr' ? 'Immobilier et biens' : 'Real estate and assets'}
            </h3>
            <p className="text-gray-600">
              {language === 'fr' ? 'Propriétés et autres biens de valeur' : 'Properties and other valuable assets'}
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-lg font-medium text-gray-900 mb-2">
              {language === 'fr' ? 'Valeur de la résidence principale' : 'Primary residence value'}
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="number"
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg text-lg focus:border-mpr-interactive focus:outline-none"
                placeholder="450,000"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-lg font-medium text-gray-900 mb-2">
              {language === 'fr' ? 'Hypothèque restante' : 'Remaining mortgage'}
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="number"
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg text-lg focus:border-mpr-interactive focus:outline-none"
                placeholder="180,000"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Revenus gouvernementaux */}
      <div className="bg-white rounded-xl border-2 border-gray-200 p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-red-100 rounded-lg">
            <Flag className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">
              {language === 'fr' ? 'Revenus gouvernementaux' : 'Government income'}
            </h3>
            <p className="text-gray-600">
              {language === 'fr' ? 'Calculés automatiquement selon vos informations' : 'Automatically calculated based on your information'}
            </p>
          </div>
        </div>
        
        <div className="bg-mpr-interactive-lt rounded-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex justify-between items-center">
              <span className="font-medium">CPP/RRQ {language === 'fr' ? 'estimé' : 'estimated'}:</span>
              <span className="text-lg font-bold text-mpr-interactive">$1,203/mois</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium">{language === 'fr' ? 'Pension de la Sécurité de la vieillesse' : 'Old Age Security'}:</span>
              <span className="text-lg font-bold text-mpr-interactive">$685/mois</span>
            </div>
          </div>
          <p className="text-sm text-mpr-navy mt-2">
            {language === 'fr' 
              ? '✓ Calculs basés sur vos 35 meilleures années de cotisation'
              : '✓ Calculations based on your 35 best contribution years'
            }
          </p>
        </div>
      </div>
    </div>
  );

  const renderDepensesSection = () => (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          💳 {language === 'fr' ? 'MES DÉPENSES ET BUDGET' : 'MY EXPENSES AND BUDGET'}
        </h2>
        <p className="text-xl text-gray-700">
          {language === 'fr' 
            ? 'Organisons toutes vos dépenses par catégories'
            : 'Let\'s organize all your expenses by categories'
          }
        </p>
      </div>

      {/* Budget mensuel de base */}
      <div className="bg-white rounded-xl border-2 border-gray-200 p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-mpr-interactive-lt rounded-lg">
            <Home className="w-6 h-6 text-mpr-interactive" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">
              {language === 'fr' ? 'Budget mensuel de base' : 'Basic monthly budget'}
            </h3>
            <p className="text-gray-600">
              {language === 'fr' ? 'Vos dépenses essentielles chaque mois' : 'Your essential expenses each month'}
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-lg font-medium text-gray-900 mb-2">
              {language === 'fr' ? 'Logement (loyer/hypothèque)' : 'Housing (rent/mortgage)'}
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="number"
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg text-lg focus:border-mpr-interactive focus:outline-none"
                placeholder="1,800"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-lg font-medium text-gray-900 mb-2">
              {language === 'fr' ? 'Alimentation' : 'Food'}
            </label>
            <div className="relative">
              <Utensils className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="number"
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg text-lg focus:border-mpr-interactive focus:outline-none"
                placeholder="600"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-lg font-medium text-gray-900 mb-2">
              {language === 'fr' ? 'Transport' : 'Transportation'}
            </label>
            <div className="relative">
              <Car className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="number"
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg text-lg focus:border-mpr-interactive focus:outline-none"
                placeholder="400"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-lg font-medium text-gray-900 mb-2">
              {language === 'fr' ? 'Services publics' : 'Utilities'}
            </label>
            <div className="relative">
              <Zap className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="number"
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg text-lg focus:border-mpr-interactive focus:outline-none"
                placeholder="250"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Dépenses annuelles */}
      <div className="bg-white rounded-xl border-2 border-gray-200 p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-green-100 rounded-lg">
            <Calendar className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">
              {language === 'fr' ? 'Dépenses annuelles' : 'Annual expenses'}
            </h3>
            <p className="text-gray-600">
              {language === 'fr' ? 'Dépenses qui reviennent chaque année' : 'Expenses that occur each year'}
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-lg font-medium text-gray-900 mb-2">
              {language === 'fr' ? 'Assurances (vie, santé, auto)' : 'Insurance (life, health, auto)'}
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="number"
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg text-lg focus:border-mpr-interactive focus:outline-none"
                placeholder="3,600"
              />
            </div>
            <p className="text-sm text-gray-600 mt-1">
              {language === 'fr' ? 'Montant total par année' : 'Total amount per year'}
            </p>
          </div>
          
          <div>
            <label className="block text-lg font-medium text-gray-900 mb-2">
              {language === 'fr' ? 'Vacances et loisirs' : 'Vacations and leisure'}
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="number"
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg text-lg focus:border-mpr-interactive focus:outline-none"
                placeholder="4,000"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Dépenses spéciales retraite */}
      <div className="bg-white rounded-xl border-2 border-orange-200 p-6 shadow-sm bg-orange-50">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-orange-100 rounded-lg">
            <Heart className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">
              {language === 'fr' ? 'Dépenses spéciales retraite' : 'Special retirement expenses'}
            </h3>
            <p className="text-gray-600">
              {language === 'fr' ? 'Nouvelles dépenses à prévoir pour la retraite' : 'New expenses to plan for retirement'}
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-lg font-medium text-gray-900 mb-2">
              {language === 'fr' ? 'Soins de santé supplémentaires' : 'Additional healthcare'}
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="number"
                className="w-full pl-10 pr-4 py-3 border-2 border-orange-300 rounded-lg text-lg focus:border-orange-500 focus:outline-none"
                placeholder="200"
              />
            </div>
            <p className="text-sm text-orange-700 mt-1">
              {language === 'fr' ? 'Par mois estimé' : 'Estimated per month'}
            </p>
          </div>
          
          <div>
            <label className="block text-lg font-medium text-gray-900 mb-2">
              {language === 'fr' ? 'Loisirs et voyages supplémentaires' : 'Additional leisure and travel'}
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="number"
                className="w-full pl-10 pr-4 py-3 border-2 border-orange-300 rounded-lg text-lg focus:border-orange-500 focus:outline-none"
                placeholder="300"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCalculsSection = () => (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          📊 {language === 'fr' ? 'MES CALCULS DE RETRAITE' : 'MY RETIREMENT CALCULATIONS'}
        </h2>
        <p className="text-xl text-gray-700">
          {language === 'fr' 
            ? 'Voyons ensemble vos résultats et recommandations'
            : 'Let\'s see your results and recommendations together'
          }
        </p>
      </div>

      {/* Résumé des calculs */}
      <div className="bg-gradient-to-r from-mpr-interactive-lt to-green-50 rounded-xl border-2 border-mpr-border p-8 shadow-sm">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            {language === 'fr' ? '🎯 Votre plan de retraite personnalisé' : '🎯 Your personalized retirement plan'}
          </h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="text-3xl font-bold text-mpr-interactive mb-2">65 ans</div>
              <div className="text-lg font-medium text-gray-900">
                {language === 'fr' ? 'Âge optimal de retraite' : 'Optimal retirement age'}
              </div>
              <div className="text-sm text-gray-600 mt-2">
                {language === 'fr' ? 'Basé sur vos objectifs' : 'Based on your goals'}
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="text-3xl font-bold text-green-600 mb-2">$4,250</div>
              <div className="text-lg font-medium text-gray-900">
                {language === 'fr' ? 'Revenus mensuels' : 'Monthly income'}
              </div>
              <div className="text-sm text-gray-600 mt-2">
                {language === 'fr' ? 'Toutes sources combinées' : 'All sources combined'}
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="text-3xl font-bold text-purple-600 mb-2">92%</div>
              <div className="text-lg font-medium text-gray-900">
                {language === 'fr' ? 'Taux de remplacement' : 'Replacement ratio'}
              </div>
              <div className="text-sm text-gray-600 mt-2">
                {language === 'fr' ? 'De votre salaire actuel' : 'Of your current salary'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Détail des revenus */}
      <div className="bg-white rounded-xl border-2 border-gray-200 p-6 shadow-sm">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">
          {language === 'fr' ? 'Détail de vos revenus mensuels à la retraite' : 'Details of your monthly retirement income'}
        </h3>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center p-4 bg-mpr-interactive-lt rounded-lg">
            <span className="font-medium">CPP/RRQ</span>
            <span className="text-lg font-bold text-mpr-interactive">$1,203</span>
          </div>
          <div className="flex justify-between items-center p-4 bg-mpr-interactive-lt rounded-lg">
            <span className="font-medium">{language === 'fr' ? 'Pension de la Sécurité de la vieillesse' : 'Old Age Security'}</span>
            <span className="text-lg font-bold text-mpr-interactive">$685</span>
          </div>
          <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
            <span className="font-medium">{language === 'fr' ? 'Régime de pension d\'employeur' : 'Employer pension plan'}</span>
            <span className="text-lg font-bold text-green-600">$1,200</span>
          </div>
          <div className="flex justify-between items-center p-4 bg-purple-50 rounded-lg">
            <span className="font-medium">{language === 'fr' ? 'Retraits REER/CELI' : 'RRSP/TFSA withdrawals'}</span>
            <span className="text-lg font-bold text-purple-600">$1,162</span>
          </div>
          <div className="border-t-2 border-gray-300 pt-4">
            <div className="flex justify-between items-center p-4 bg-gray-100 rounded-lg">
              <span className="text-xl font-bold">{language === 'fr' ? 'Total mensuel' : 'Monthly total'}</span>
              <span className="text-2xl font-bold text-gray-900">$4,250</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recommandations */}
      <div className="bg-yellow-50 rounded-xl border-2 border-yellow-200 p-6 shadow-sm">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">
          💡 {language === 'fr' ? 'Recommandations personnalisées' : 'Personalized recommendations'}
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 bg-white rounded-lg">
            <CheckCircle className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
            <div>
              <div className="font-medium text-gray-900">
                {language === 'fr' ? 'Excellent! Votre plan est solide' : 'Excellent! Your plan is solid'}
              </div>
              <div className="text-gray-600 mt-1">
                {language === 'fr' 
                  ? 'Vos revenus de retraite couvriront confortablement vos dépenses prévues.'
                  : 'Your retirement income will comfortably cover your expected expenses.'
                }
              </div>
            </div>
          </div>
          
          <div className="flex items-start gap-3 p-4 bg-white rounded-lg">
            <TrendingUp className="w-6 h-6 text-mpr-interactive mt-1 flex-shrink-0" />
            <div>
              <div className="font-medium text-gray-900">
                {language === 'fr' ? 'Considérez reporter votre retraite de 2 ans' : 'Consider delaying retirement by 2 years'}
              </div>
              <div className="text-gray-600 mt-1">
                {language === 'fr' 
                  ? 'Cela augmenterait vos revenus mensuels de $650 et réduirait les risques.'
                  : 'This would increase your monthly income by $650 and reduce risks.'
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 seniors-mode">
      <div className="container mx-auto px-4 py-8">
        {/* En-tête de la page */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            💰 {language === 'fr' ? 'MA RETRAITE' : 'MY RETIREMENT'}
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            {language === 'fr' 
              ? 'Planifions ensemble votre avenir financier étape par étape'
              : 'Let\'s plan your financial future together step by step'
            }
          </p>
        </div>

        {/* Barre de progression globale */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-lg font-medium text-gray-900">
              {language === 'fr' ? 'Progression globale' : 'Overall progress'}
            </span>
            <span className="text-lg font-bold text-mpr-interactive">53%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div className="bg-mpr-interactive h-3 rounded-full" style={{ width: '53%' }}></div>
          </div>
        </div>

        {/* Navigation par onglets */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-center gap-4">
            {sections.map((section) => {
              const status = getSectionStatus(section.id);
              const StatusIcon = status.icon;
              
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`flex flex-col items-center p-6 rounded-xl border-2 transition-all duration-200 min-w-[200px] ${
                    activeSection === section.id
                      ? 'bg-mpr-interactive-lt border-mpr-interactive text-mpr-navy shadow-md'
                      : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl">{section.icon}</span>
                    <StatusIcon className={`w-5 h-5 text-${status.color}-500`} />
                  </div>
                  <span className="text-lg font-semibold mb-2">{section.title}</span>
                  <span className="text-sm text-center leading-tight">{section.description}</span>
                  
                  {/* Barre de progression de la section */}
                  <div className="w-full mt-3">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`bg-${status.color}-500 h-2 rounded-full transition-all duration-300`}
                        style={{ width: `${sectionProgress.find(s => s.id === section.id)?.progress || 0}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-600 mt-1 text-center">
                      {sectionProgress.find(s => s.id === section.id)?.progress || 0}% {language === 'fr' ? 'complété' : 'completed'}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Contenu de la section active */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          {activeSection === 'revenus' && renderRevenuSection()}
          {activeSection === 'depenses' && renderDepensesSection()}
          {activeSection === 'calculs' && renderCalculsSection()}
        </div>

        {/* Boutons de navigation */}
        <div className="flex justify-between items-center mt-8">
          <button
            onClick={() => {
              const currentIndex = sections.findIndex(s => s.id === activeSection);
              if (currentIndex > 0) {
                setActiveSection(sections[currentIndex - 1].id);
              }
            }}
            disabled={sections.findIndex(s => s.id === activeSection) === 0}
            className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-5 h-5 rotate-180" />
            {language === 'fr' ? 'Section précédente' : 'Previous section'}
          </button>

          <div className="flex items-center gap-4">
            <button className="px-6 py-3 bg-mpr-interactive-lt text-mpr-navy rounded-lg font-medium hover:bg-mpr-interactive-lt transition-colors">
              {language === 'fr' ? 'Sauvegarder' : 'Save'}
            </button>
            <button className="px-6 py-3 bg-green-100 text-green-700 rounded-lg font-medium hover:bg-green-200 transition-colors">
              {language === 'fr' ? 'Aide' : 'Help'}
            </button>
          </div>

          <button
            onClick={() => {
              const currentIndex = sections.findIndex(s => s.id === activeSection);
              if (currentIndex < sections.length - 1) {
                setActiveSection(sections[currentIndex + 1].id);
              }
            }}
            disabled={sections.findIndex(s => s.id === activeSection) === sections.length - 1}
            className="flex items-center gap-2 px-6 py-3 bg-mpr-interactive text-white rounded-lg font-medium hover:bg-mpr-interactive-dk transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {language === 'fr' ? 'Section suivante' : 'Next section'}
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
