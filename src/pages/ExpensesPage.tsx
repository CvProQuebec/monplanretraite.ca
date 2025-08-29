import React, { useState, useEffect } from 'react';
import { CashflowSection } from '@/features/retirement/sections/CashflowSection';
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
  retirement: {},
  savings: {},
  cashflow: {
    logement: 1200,
    servicesPublics: 200,
    assurances: 150,
    telecom: 100,
    alimentation: 600,
    transport: 400,
    sante: 200,
    loisirs: 300
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
    budgetManagement: isFrench ? 'Gestion du budget' : 'Budget Management',
    budgetSubtitle: isFrench 
      ? 'Suivez vos revenus et dépenses mensuels'
      : 'Track your monthly income and expenses',
    help: isFrench ? 'Aide' : 'Help',
    cashflowManagement: isFrench 
      ? 'Gestion du flux de trésorerie : Suivez vos dépenses mensuelles pour identifier les opportunités d\'épargne. La règle du 50/30/20 recommande 50 % pour les besoins essentiels, 30 % pour les envies, et 20 % pour l\'épargne.'
      : 'Cash flow management: Track your monthly expenses to identify savings opportunities. The 50/30/20 rule recommends 50% for essential needs, 30% for wants, and 20% for savings.',
    expenseBreakdown: isFrench 
      ? 'Ventilation des dépenses : Utilisez le bouton "Ventiler" pour détailler chaque catégorie de dépenses en sous-catégories.'
      : 'Expense breakdown: Use the "Breakdown" button to detail each expense category into sub-categories.'
  };

  const handleUpdate = (section: keyof UserData, updates: any) => {
    setUserData(prevData => ({
      ...prevData,
      [section]: {
        ...prevData[section],
        ...updates
      }
    }));
  };

  // Charger les données depuis le stockage local
  useEffect(() => {
    try {
      const savedData = localStorage.getItem('retirement_data');
      if (savedData) {
        const data = JSON.parse(savedData);
        if (data.cashflow) {
          setUserData(prevData => ({
            ...prevData,
            cashflow: { ...prevData.cashflow, ...data.cashflow }
          }));
        }
      }
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-blue-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-600 p-3 rounded-full">
              <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            {t.title}
          </h1>
          <p className="text-lg text-blue-100 max-w-3xl mx-auto">
            {t.subtitle}
          </p>
        </div>

        {/* Section Budget Management */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-orange-300 mb-2">
            {t.budgetManagement}
          </h2>
          <p className="text-lg text-blue-100">
            {t.budgetSubtitle}
          </p>
          <button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
            <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {t.help}
          </button>
        </div>

        {/* Composant CashflowSection existant */}
        <CashflowSection 
          data={userData} 
          onUpdate={handleUpdate} 
        />

        {/* Informations supplémentaires */}
        <div className="mt-8 bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="text-white">
              <p className="text-sm leading-relaxed">
                {t.cashflowManagement}
              </p>
            </div>
            <div className="text-white">
              <p className="text-sm leading-relaxed">
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
