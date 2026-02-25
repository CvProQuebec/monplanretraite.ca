import React, { useState } from 'react';
import { UserData } from '../../types';

interface SeasonalExpense {
  id: string;
  category: 'automobile' | 'maison' | 'sante' | 'taxes' | 'personnel';
  name: string;
  description: string;
  isActive: boolean;
  estimatedAmount: number;
  frequency: 'annually' | 'biannually' | 'every2years' | 'every3years' | 'every5years' | 'asNeeded';
  isPlanned: boolean;
  plannedDate?: string;
  notes?: string;
}

interface SeasonalExpensesPlannerProps {
  data: UserData;
  onUpdate: (updates: any) => void;
  language: string;
}

const seasonalExpensesData: SeasonalExpense[] = [
  // AUTOMOBILE
  {
    id: 'auto-oil-change',
    category: 'automobile',
    name: 'Changement d\'huile',
    description: 'Entretien saisonnier du véhicule (2-3 fois par an)',
    isActive: false,
    estimatedAmount: 80,
    frequency: 'biannually',
    isPlanned: false
  },
  {
    id: 'auto-winter-tires',
    category: 'automobile', 
    name: 'Pneus d\'hiver',
    description: 'Changement et entreposage (remplacement aux 4-5 ans)',
    isActive: false,
    estimatedAmount: 800,
    frequency: 'every5years',
    isPlanned: false
  },
  {
    id: 'auto-summer-tires',
    category: 'automobile',
    name: 'Pneus d\'été', 
    description: 'Changement et entreposage (remplacement aux 4-5 ans)',
    isActive: false,
    estimatedAmount: 800,
    frequency: 'every5years',
    isPlanned: false
  },
  {
    id: 'auto-inspection',
    category: 'automobile',
    name: 'Inspection annuelle',
    description: 'Inspection obligatoire du véhicule',
    isActive: false,
    estimatedAmount: 45,
    frequency: 'annually',
    isPlanned: false
  },

  // MAISON
  {
    id: 'home-tree-trimming',
    category: 'maison',
    name: 'Émondage des arbres',
    description: 'Taille et élagage (propriétaires avec arbres matures)',
    isActive: false,
    estimatedAmount: 500,
    frequency: 'every3years',
    isPlanned: false
  },
  {
    id: 'home-pool-opening',
    category: 'maison',
    name: 'Ouverture de piscine',
    description: 'Produits chimiques et équipements (propriétaires de piscine)',
    isActive: false,
    estimatedAmount: 400,
    frequency: 'annually',
    isPlanned: false
  },
  {
    id: 'home-pool-closing',
    category: 'maison', 
    name: 'Fermeture de piscine',
    description: 'Hivernage et protection (propriétaires de piscine)',
    isActive: false,
    estimatedAmount: 200,
    frequency: 'annually',
    isPlanned: false
  },
  {
    id: 'home-snow-removal',
    category: 'maison',
    name: 'Déneigement commercial',
    description: 'Service de déneigement hivernal',
    isActive: false,
    estimatedAmount: 600,
    frequency: 'annually',
    isPlanned: false
  },
  {
    id: 'home-major-repairs',
    category: 'maison',
    name: 'Réparations majeures',
    description: 'Toiture, plomberie, électricité (selon nécessité)',
    isActive: false,
    estimatedAmount: 2000,
    frequency: 'asNeeded',
    isPlanned: false
  },
  {
    id: 'home-appliances',
    category: 'maison',
    name: 'Remplacement électroménagers',
    description: 'Réfrigérateur, laveuse, sécheuse (durée de vie 8-12 ans)',
    isActive: false,
    estimatedAmount: 1500,
    frequency: 'asNeeded',
    isPlanned: false
  },

  // SANTÉ
  {
    id: 'health-dental-major',
    category: 'sante',
    name: 'Soins dentaires majeurs',
    description: 'Couronnes, implants, prothèses (non couverts)',
    isActive: false,
    estimatedAmount: 3000,
    frequency: 'asNeeded',
    isPlanned: false
  },
  {
    id: 'health-glasses',
    category: 'sante',
    name: 'Lunettes/lentilles',
    description: 'Examen de la vue et nouvelle prescription',
    isActive: false,
    estimatedAmount: 400,
    frequency: 'every2years',
    isPlanned: false
  },
  {
    id: 'health-medical-equipment',
    category: 'sante',
    name: 'Équipements médicaux',
    description: 'Fauteuil roulant, déambulateur, oxygène (selon besoin)',
    isActive: false,
    estimatedAmount: 1000,
    frequency: 'asNeeded',
    isPlanned: false
  },

  // TAXES
  {
    id: 'tax-municipal',
    category: 'taxes',
    name: 'Taxes municipales',
    description: 'Paiement annuel ou semestriel (propriétaires)',
    isActive: false,
    estimatedAmount: 3600,
    frequency: 'annually',
    isPlanned: false
  },
  {
    id: 'tax-school',
    category: 'taxes',
    name: 'Taxes scolaires', 
    description: 'Paiement annuel ou semestriel (propriétaires)',
    isActive: false,
    estimatedAmount: 800,
    frequency: 'annually',
    isPlanned: false
  },

  // PERSONNEL
  {
    id: 'personal-vacation',
    category: 'personnel',
    name: 'Vacances annuelles',
    description: 'Budget voyage ou activités de loisir',
    isActive: false,
    estimatedAmount: 2000,
    frequency: 'annually',
    isPlanned: false
  },
  {
    id: 'personal-gifts',
    category: 'personnel',
    name: 'Cadeaux (Noël, anniversaires)',
    description: 'Budget pour les fêtes et événements familiaux',
    isActive: false,
    estimatedAmount: 800,
    frequency: 'annually',
    isPlanned: false
  }
];

const categories = [
  { id: 'automobile', name: 'Automobile', icon: '🚗' },
  { id: 'maison', name: 'Maison', icon: '🏠' },
  { id: 'sante', name: 'Santé', icon: '🏥' },
  { id: 'taxes', name: 'Taxes', icon: '📋' },
  { id: 'personnel', name: 'Personnel', icon: '🎯' }
];

const frequencyLabels = {
  'annually': 'Annuel',
  'biannually': 'Deux fois/an',
  'every2years': 'Aux 2 ans',
  'every3years': 'Aux 3 ans',
  'every5years': 'Aux 5 ans',
  'asNeeded': 'Selon besoin'
};

const frequencyMultiplier = {
  'annually': 1,
  'biannually': 2, 
  'every2years': 0.5,
  'every3years': 0.33,
  'every5years': 0.2,
  'asNeeded': 0
};

export const SeasonalExpensesPlannerModule: React.FC<SeasonalExpensesPlannerProps> = ({
  data,
  onUpdate,
  language
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('automobile');
  
  // Récupérer les données existantes ou utiliser les données par défaut
  const existingExpenses = data.seasonalExpenses?.expenses || [];
  const [expenses, setExpenses] = useState<SeasonalExpense[]>(() => {
    if (existingExpenses.length > 0) {
      return existingExpenses;
    }
    return seasonalExpensesData;
  });

  const updateExpense = (id: string, updates: Partial<SeasonalExpense>) => {
    const updatedExpenses = expenses.map(exp => 
      exp.id === id ? { ...exp, ...updates } : exp
    );
    setExpenses(updatedExpenses);
    
    // Sauvegarder via onUpdate
    onUpdate({
      expenses: updatedExpenses,
      lastUpdated: new Date().toISOString()
    });
  };

  const getPlannedExpensesTotal = () => {
    return expenses
      .filter(exp => exp.isActive && exp.isPlanned)
      .reduce((total, exp) => total + exp.estimatedAmount, 0);
  };

  const getAnnualProvisionTotal = () => {
    return expenses
      .filter(exp => exp.isActive)
      .reduce((total, exp) => {
        return total + (exp.estimatedAmount * (frequencyMultiplier[exp.frequency] || 0));
      }, 0);
  };

  return (
    <div className="bg-white rounded-xl p-6 border-2 border-gray-300">
      <h2 className="text-2xl font-bold mb-6 text-center">
        📅 Planificateur de dépenses saisonnières et occasionnelles
      </h2>
      
      {/* Navigation par catégories */}
      <div className="flex mb-6 border-b">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-4 py-2 mr-2 rounded-t-lg font-medium ${
              activeCategory === cat.id 
                ? 'bg-mpr-interactive text-white border-b-2 border-mpr-interactive' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {cat.icon} {cat.name}
          </button>
        ))}
      </div>

      {/* Liste des dépenses par catégorie */}
      <div className="space-y-4">
        {expenses
          .filter(exp => exp.category === activeCategory)
          .map(expense => (
            <div key={expense.id} className="border rounded-lg p-4 hover:bg-gray-50">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  {/* Case à cocher "S'applique à moi" */}
                  <input
                    type="checkbox"
                    checked={expense.isActive}
                    onChange={(e) => updateExpense(expense.id, { isActive: e.target.checked })}
                    className="mt-1 h-5 w-5 text-mpr-interactive"
                  />
                  
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{expense.name}</h3>
                    <p className="text-gray-600 text-sm mb-2">{expense.description}</p>
                    
                    {expense.isActive && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                        {/* Montant estimé */}
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Montant estimé ($)
                          </label>
                          <input
                            type="number"
                            value={expense.estimatedAmount}
                            onChange={(e) => updateExpense(expense.id, { 
                              estimatedAmount: Number(e.target.value) 
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          />
                        </div>

                        {/* Planifié cette année */}
                        <div>
                          <label className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={expense.isPlanned}
                              onChange={(e) => updateExpense(expense.id, { 
                                isPlanned: e.target.checked 
                              })}
                              className="h-4 w-4 text-mpr-interactive"
                            />
                            <span className="text-sm font-medium">
                              Planifié pour cette année
                            </span>
                          </label>
                        </div>

                        {/* Date planifiée */}
                        {expense.isPlanned && (
                          <div>
                            <label className="block text-sm font-medium mb-1">
                              Date prévue
                            </label>
                            <input
                              type="date"
                              value={expense.plannedDate || ''}
                              onChange={(e) => updateExpense(expense.id, { 
                                plannedDate: e.target.value 
                              })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Fréquence */}
                <div className="text-right">
                  <span className="text-sm text-gray-500">
                    {frequencyLabels[expense.frequency]}
                  </span>
                </div>
              </div>
            </div>
          ))}
      </div>

      {/* Résumé budgétaire */}
      <div className="mt-6 bg-mpr-interactive-lt rounded-lg p-4">
        <h3 className="font-bold text-lg mb-2">📊 Impact budgétaire annuel</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Dépenses planifiées cette année</p>
            <p className="text-2xl font-bold text-mpr-interactive">
              {new Intl.NumberFormat('fr-CA', { 
                style: 'currency', 
                currency: 'CAD' 
              }).format(getPlannedExpensesTotal())}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Provision annuelle recommandée</p>
            <p className="text-2xl font-bold text-green-600">
              {new Intl.NumberFormat('fr-CA', { 
                style: 'currency', 
                currency: 'CAD' 
              }).format(getAnnualProvisionTotal())}
            </p>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          * La provision inclut une moyenne des dépenses récurrentes selon leur fréquence
        </p>
      </div>
    </div>
  );
};

export default SeasonalExpensesPlannerModule;