import React, { useState, useEffect } from 'react';
import { CashflowSection } from '@/features/retirement/sections/CashflowSection';
import SeasonalExpensesPlannerModule from '@/components/ui/SeasonalExpensesPlannerModule';
import MonthlyBudgetPlanningModule from '@/components/ui/MonthlyBudgetPlanningModule';
import { UserData } from '@/features/retirement/types';
import { useLanguage } from '@/features/retirement/hooks/useLanguage';

// Données de démonstration
const demoUserData: UserData = {
  personal: {
    prenom1: 'Jean',
    prenom2: 'Marie',
    naissance1: '1980-01-01',
    naissance2: '1982-01-01',
    sexe1: 'M' as const,
    sexe2: 'F' as const,
    salaire1: 60000,
    salaire2: 55000,
    statutProfessionnel1: 'actif',
    statutProfessionnel2: 'actif',
    ageRetraiteSouhaite1: 65,
    ageRetraiteSouhaite2: 65,
    depensesRetraite: 4000
  },
  retirement: {
    rrqAgeActuel1: 0,
    rrqMontantActuel1: 0,
    rrqMontant70_1: 0,
    esperanceVie1: 85,
    rrqAgeActuel2: 0,
    rrqMontantActuel2: 0,
    rrqMontant70_2: 0,
    esperanceVie2: 87,
    rregopMembre1: 'non',
    rregopAnnees1: 0,
    pensionPrivee1: 0,
    pensionPrivee2: 0
  },
  savings: {
    reer1: 0,
    reer2: 0,
    celi1: 0,
    celi2: 0,
    placements1: 0,
    placements2: 0,
    epargne1: 0,
    epargne2: 0,
    cri1: 0,
    cri2: 0,
    residenceValeur: 0,
    residenceHypotheque: 0
  },
  cashflow: {
    logement: 1200,
    servicesPublics: 200,
    assurances: 150,
    telecom: 100,
    alimentation: 600,
    transport: 400,
    sante: 200,
    loisirs: 300,
    // Initialiser les ventilations vides
    logementBreakdown: {},
    servicesPublicsBreakdown: {},
    assurancesBreakdown: {},
    transportBreakdown: {},
    santeBreakdown: {},
    telecomBreakdown: {}
  }
};

export const ExpensesPage: React.FC = () => {
  const [userData, setUserData] = useState<UserData>(demoUserData);
  const { language } = useLanguage();
  const isFrench = language === 'fr';

  // Traductions
  const t = {
    title: isFrench ? 'Gestion des dépenses mensuelles' : 'Monthly Expense Management',
    subtitle: isFrench 
      ? 'Planifiez et suivez vos dépenses mensuelles pour optimiser votre budget de retraite'
      : 'Plan and track your monthly expenses to optimize your retirement budget',
    cashflowManagement: isFrench 
      ? 'Gestion du flux de trésorerie : Suivez vos dépenses mensuelles pour identifier les opportunités d\'épargne. La règle du 50/30/20 recommande 50 % pour les besoins essentiels, 30 % pour les envies, et 20 % pour l\'épargne.'
      : 'Cash flow management: Track your monthly expenses to identify savings opportunities. The 50/30/20 rule recommends 50% for essential needs, 30% for wants, and 20% for savings.',
    expenseBreakdown: isFrench 
      ? 'Ventilation des dépenses : Utilisez le bouton "Ventiler" pour détailler chaque catégorie de dépenses en sous-catégories.'
      : 'Expense breakdown: Use the "Breakdown" button to detail each expense category into sub-categories.'
  };

  const handleUpdate = (section: keyof UserData, updates: any) => {
    setUserData(prevData => {
      const newData = {
        ...prevData,
        [section]: {
          ...prevData[section],
          ...updates
        }
      };
      
      // Sauvegarder automatiquement dans localStorage avec toutes les ventilations
      try {
        localStorage.setItem('retirement_data', JSON.stringify(newData));
        console.log('Données sauvegardées dans localStorage:', newData);
      } catch (error) {
        console.error('Erreur lors de la sauvegarde:', error);
      }
      
      return newData;
    });
  };

  // Charger les données depuis le stockage local incluant les ventilations
  useEffect(() => {
    try {
      const savedData = localStorage.getItem('retirement_data');
      if (savedData) {
        const data = JSON.parse(savedData);
        
        // Code existant pour cashflow INCHANGÉ
        if (data.cashflow) {
          // Charger toutes les données cashflow incluant les ventilations
          setUserData(prevData => ({
            ...prevData,
            cashflow: { 
              ...prevData.cashflow, 
              ...data.cashflow,
              // S'assurer que toutes les ventilations sont chargées
              logementBreakdown: data.cashflow.logementBreakdown || {},
              servicesPublicsBreakdown: data.cashflow.servicesPublicsBreakdown || {},
              assurancesBreakdown: data.cashflow.assurancesBreakdown || {},
              transportBreakdown: data.cashflow.transportBreakdown || {},
              santeBreakdown: data.cashflow.santeBreakdown || {},
              telecomBreakdown: data.cashflow.telecomBreakdown || {}
            }
          }));
          console.log('Données chargées depuis localStorage (incluant ventilations):', data.cashflow);
        }
        
        // AJOUTER seulement cette section :
        if (data.seasonalExpenses) {
          setUserData(prevData => ({
            ...prevData,
            seasonalExpenses: data.seasonalExpenses
          }));
          console.log('Dépenses saisonnières chargées:', data.seasonalExpenses);
        }
      }
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    }
  }, []);

return (
    <div className="min-h-screen bg-white seniors-mode">
      <div className="container mx-auto px-6 py-8" role="main" aria-labelledby="page-title">
        {/* Breadcrumb + Retour */}
        <nav aria-label="breadcrumb" className="mb-4 flex items-center justify-between">
          <button onClick={() => window.history.back()} className="button-primary px-4 py-2" aria-label={isFrench ? 'Retour' : 'Back'}>
            {isFrench ? 'Retour' : 'Back'}
          </button>
          <div className="text-sm">
            <a href="/" className="navigation-link">{isFrench ? 'Accueil' : 'Home'}</a>
            <span className="mx-2">›</span>
            <span className="font-semibold">{isFrench ? 'Dépenses' : 'Expenses'}</span>
          </div>
        </nav>

        {/* Header */}
        <div className="bg-white border-2 border-gray-300 rounded-xl p-6 text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-white p-3 rounded-full border-2 border-blue-600">
              <svg className="h-8 w-8 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <h1 id="page-title" className="text-4xl font-bold text-black mb-2">
            {t.title}
          </h1>
          <p className="text-lg text-black max-w-3xl mx-auto">
            {t.subtitle}
          </p>
        </div>


        {/* Composant CashflowSection existant */}
        <CashflowSection 
          data={userData} 
          onUpdate={handleUpdate} 
        />

        {/* Nouveau volet Dépenses saisonnières et irrégulières */}
        <div className="mt-8 bg-white rounded-xl p-6 border-2 border-gray-300">
          <SeasonalExpensesPlannerModule
            data={userData}
            onUpdate={(updates) => handleUpdate('seasonalExpenses', updates)}
            language={language}
          />
        </div>

        {/* Nouveau volet Planification Budgétaire Mensuelle */}
        <div className="mt-8 bg-white rounded-xl p-6 border-2 border-gray-300">
          <MonthlyBudgetPlanningModule
            data={userData}
            onUpdate={(updates) => handleUpdate('cashflow', updates)}
            language={language}
          />
        </div>

        {/* Informations supplémentaires */}
        <div className="mt-8 bg-white rounded-xl p-6 border-2 border-gray-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="text-black">
              <p className="text-base leading-relaxed">
                {t.cashflowManagement}
              </p>
            </div>
            <div className="text-black">
              <p className="text-base leading-relaxed">
                {t.expenseBreakdown}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpensesPage;
