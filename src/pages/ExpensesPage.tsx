import React, { useState, useEffect, useMemo } from 'react';
import { CashflowSection } from '@/features/retirement/sections/CashflowSection';
import SeasonalExpensesPlannerModule from '@/components/ui/SeasonalExpensesPlannerModule';
import MonthlyBudgetPlanningModule from '@/components/ui/MonthlyBudgetPlanningModule';
import { UserData } from '@/features/retirement/types';
import { useLanguage } from '@/features/retirement/hooks/useLanguage';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { DataMigrationService } from '@/services/DataMigrationService';
import OverdraftPreventionService from '@/services/OverdraftPreventionService';
import PurchaseOptionsComparator from '@/components/ui/PurchaseOptionsComparator';
import NotificationSchedulerService from '@/services/NotificationSchedulerService';
import { FormGrid, FormRow, Field } from '@/components/forms/FormGrid';

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
    includeFlags: {
      logement: true,
      servicesPublics: true,
      assurances: true,
      telecom: true,
      alimentation: true,
      transport: true,
      sante: true,
      loisirs: true
    },
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

  // Analyse de prévention des découverts (local, heuristiques simples)
  const overdraft = useMemo(() => OverdraftPreventionService.analyze(userData), [userData]);

  // Planification auto des rappels fin de mois si risque élevé
  const [monthEndScheduled, setMonthEndScheduled] = useState(false);
  useEffect(() => {
    if (overdraft.riskLevel === 'high') {
      const scenarioId = ((userData.personal as any)?.activeScenarioId) || 'expenses-default';
      const key = `mpr-monthend-scheduled:${scenarioId}`;
      try {
        const done = localStorage.getItem(key);
        if (!done) {
          NotificationSchedulerService.scheduleMonthEndSync({ scenarioId, months: 3 });
          localStorage.setItem(key, '1');
          setMonthEndScheduled(true);
        }
      } catch {
        // Ignorer erreurs de stockage local
      }
    }
  }, [overdraft.riskLevel]);

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
      : 'Expense breakdown: Use the "Breakdown" button to detail each expense category into sub-categories.',
    syncWithBudgetTitle: isFrench
      ? 'Synchronisation avec le budget'
      : 'Budget synchronization',
    includeInBudget: isFrench
      ? 'Inclure dans le budget'
      : 'Include in budget',
    housing: isFrench ? 'Logement' : 'Housing',
    utilities: isFrench ? 'Services publics' : 'Utilities',
    insurance: isFrench ? 'Assurances' : 'Insurance',
    telecom: isFrench ? 'Télécommunications' : 'Telecom',
    food: isFrench ? 'Alimentation' : 'Food',
    transport: isFrench ? 'Transport' : 'Transport',
    health: isFrench ? 'Santé' : 'Health',
    leisure: isFrench ? 'Loisirs' : 'Leisure'
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
        // Notifier l'auto-save du Wizard (Phase 2) si présent
        try { (window as any).mprNotifyDataChanged?.(); } catch {}
      } catch (error) {
        console.error('Erreur lors de la sauvegarde:', error);
      }
      
      return newData;
    });
  };

  const defaultIncludeFlags = {
    logement: true,
    servicesPublics: true,
    assurances: true,
    telecom: true,
    alimentation: true,
    transport: true,
    sante: true,
    loisirs: true
  };

  const handleIncludeToggle = (key: keyof typeof defaultIncludeFlags, checked: boolean) => {
    const nextFlags = {
      ...(userData.cashflow as any)?.includeFlags || defaultIncludeFlags,
      [key]: checked
    };
    handleUpdate('cashflow', { includeFlags: nextFlags });
  };

  // Charger les données depuis le stockage local incluant les ventilations
  useEffect(() => {
    try {
      const savedData = localStorage.getItem('retirement_data');
      if (savedData) {
        const data = JSON.parse(savedData);
        
        // Migration vers la nouvelle structure (Phase 1 — déduplication Immobilier ↔ Dépenses)
        try {
          if (DataMigrationService.needsMigration()) {
            const res = DataMigrationService.migrateUserData(data);
            if (res?.success) {
              DataMigrationService.saveMigratedData(data);
              console.log('✅ Migration effectuée (Phase 1) :', res.migratedFields);
            } else {
              console.warn('⚠️ Migration avec avertissements :', res?.errors);
            }
          }
        } catch (mErr) {
          console.warn('⚠️ Erreur lors de la migration Phase 1 :', mErr);
        }
        
        // Code existant pour cashflow INCHANGÉ
        if (data.cashflow) {
          // Charger toutes les données cashflow incluant les ventilations
          setUserData(prevData => ({
            ...prevData,
            cashflow: { 
              ...prevData.cashflow, 
              ...data.cashflow,
              includeFlags: (data.cashflow as any).includeFlags || defaultIncludeFlags,
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

        {/* Bonnes pratiques - Dépenses comme source de vérité */}
        <Alert className="border-blue-200 bg-blue-50 text-blue-800 mb-6">
          <AlertDescription>
            {isFrench
              ? 'Meilleure pratique : saisissez vos dépenses ici. Elles s’afficheront automatiquement dans votre budget. Vous évitez ainsi de les retaper.'
              : 'Best practice: enter your expenses here. They will automatically appear in your budget. No need to type them twice.'}
          </AlertDescription>
        </Alert>

        {/* Synchronisation avec le Budget: choix d'inclusion des catégories principales */}
        <div className="bg-white rounded-xl p-6 border-2 border-gray-300 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{t.syncWithBudgetTitle}</h2>
          <p className="text-gray-700 mb-4">
            {isFrench
              ? 'Sélectionnez les catégories à inclure dans votre budget. Ces montants seront importés automatiquement.'
              : 'Select which categories to include in your budget. These amounts will be imported automatically.'}
          </p>
          
          {/* CONDENSÉ EN 2 LIGNES DE 4 COLONNES POUR RÉDUIRE LA HAUTEUR */}
          <div className="grid grid-cols-4 gap-4">
            {([
              { key: 'logement', label: t.housing },
              { key: 'servicesPublics', label: t.utilities },
              { key: 'assurances', label: t.insurance },
              { key: 'telecom', label: t.telecom },
              { key: 'alimentation', label: t.food },
              { key: 'transport', label: t.transport },
              { key: 'sante', label: t.health },
              { key: 'loisirs', label: t.leisure }
            ] as Array<{key: keyof typeof defaultIncludeFlags, label: string}>).map(item => {
              const flags = (userData.cashflow as any)?.includeFlags || defaultIncludeFlags;
              const checked = flags[item.key] !== false;
              return (
                <div key={item.key} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    className="w-5 h-5"
                    checked={checked}
                    onChange={(e) => handleIncludeToggle(item.key, e.target.checked)}
                    aria-label={`${t.includeInBudget} - ${item.label}`}
                  />
                  <label className="text-sm font-medium text-gray-700">
                    {item.label}
                  </label>
                </div>
              );
            })}
          </div>
        </div>

        {/* Composant CashflowSection existant */}
        <CashflowSection 
          data={userData} 
          onUpdate={handleUpdate} 
        />

        {/* Prévention des découverts */}
        <div className="mt-8 bg-white rounded-xl p-6 border-2 border-red-300">
          <h2 className="text-2xl font-bold text-red-800 mb-2">
            {isFrench ? 'Prévention des découverts' : 'Overdraft prevention'}
          </h2>
          <p className="text-sm text-gray-700 mb-4">
            {isFrench
              ? 'Surveillez votre marge mensuelle et votre fonds d’urgence pour éviter les découverts bancaires.'
              : 'Monitor your monthly buffer and emergency fund to prevent bank overdrafts.'}
          </p>

          {monthEndScheduled && (
            <div className="mb-4 text-sm text-blue-800 bg-blue-50 border border-blue-200 rounded-lg p-3">
              {isFrench
                ? 'Rappels fin de mois planifiés pour les 3 prochains mois.'
                : 'Month-end reminders scheduled for the next 3 months.'}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm">
              <div className="text-red-800 font-semibold">{isFrench ? 'Revenu net mensuel' : 'Net monthly income'}</div>
              <div className="text-red-900 text-lg font-bold">
                {overdraft.netMonthlyIncome.toLocaleString(isFrench ? 'fr-CA' : 'en-CA', { style: 'currency', currency: 'CAD' })}
              </div>
            </div>
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 text-sm">
              <div className="text-orange-800 font-semibold">{isFrench ? 'Dépenses mensuelles' : 'Monthly expenses'}</div>
              <div className="text-orange-900 text-lg font-bold">
                {overdraft.totalMonthlyExpenses.toLocaleString(isFrench ? 'fr-CA' : 'en-CA', { style: 'currency', currency: 'CAD' })}
              </div>
            </div>
            <div className={`${overdraft.monthlyCashflow >= 0 ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200'} border rounded-lg p-3 text-sm`}>
              <div className={`${overdraft.monthlyCashflow >= 0 ? 'text-emerald-800' : 'text-amber-800'} font-semibold`}>
                {isFrench ? 'Flux de trésorerie mensuel' : 'Monthly cash flow'}
              </div>
              <div className={`${overdraft.monthlyCashflow >= 0 ? 'text-emerald-900' : 'text-amber-900'} text-lg font-bold`}>
                {overdraft.monthlyCashflow.toLocaleString(isFrench ? 'fr-CA' : 'en-CA', { style: 'currency', currency: 'CAD' })}
              </div>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm">
              <div className="text-blue-800 font-semibold">{isFrench ? 'Fonds d’urgence estimé' : 'Estimated emergency fund'}</div>
              <div className="text-blue-900 text-lg font-bold">
                {overdraft.emergencySaved.toLocaleString(isFrench ? 'fr-CA' : 'en-CA', { style: 'currency', currency: 'CAD' })}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            {overdraft.alerts.map((a, i) => {
              const color =
                a.severity === 'error' ? { bg: 'bg-red-50', border: 'border-red-300', text: 'text-red-900', title: 'text-red-800' } :
                a.severity === 'warning' ? { bg: 'bg-amber-50', border: 'border-amber-300', text: 'text-amber-900', title: 'text-amber-800' } :
                { bg: 'bg-blue-50', border: 'border-blue-300', text: 'text-blue-900', title: 'text-blue-800' };
              return (
                <div key={a.id + i} className={`${color.bg} ${color.border} border rounded-lg p-3`}>
                  <div className={`font-semibold ${color.title}`}>
                    {a.severity === 'error' ? (isFrench ? 'Critique' : 'Critical')
                      : a.severity === 'warning' ? (isFrench ? 'Avertissement' : 'Warning')
                      : (isFrench ? 'Information' : 'Info')}
                  </div>
                  <div className={`${color.text} text-sm`}>{a.message}</div>
                  {a.suggestion && <div className="text-gray-700 text-sm mt-1">{a.suggestion}</div>}
                </div>
              );
            })}
          </div>
        </div>

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

        {/* Comparateur d’options d’achat */}
        <div className="mt-8 bg-white rounded-xl p-6 border-2 border-gray-300">
          <PurchaseOptionsComparator />
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
