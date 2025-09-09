import React, { useState, useEffect } from 'react';
import '../../senior-unified-styles.css';
import { useLanguage } from '@/features/retirement/hooks/useLanguage';
import { useRetirementData } from '@/features/retirement/hooks/useRetirementData';
import { IncomeIntegrationService } from '@/services/IncomeIntegrationService';
import { useAuth } from '@/hooks/useAuth';
import { checkFeatureAccess, getRequiredPlanForFeature, getContextualUpgradeMessage } from '@/config/plans';
import { PromoCodeService } from '@/services/promoCodeService';
import { usePromoCode } from '@/hooks/usePromoCode';
import AdvancedUpgradeModal from '@/components/ui/advanced-upgrade-modal';
import DateInput from '@/components/ui/DateInput';
import MoneyInput from '@/components/ui/MoneyInput';
import { EnhancedSaveManager } from '@/services/EnhancedSaveManager';

// Types pour le budget
interface ExpenseEntry {
  id: string;
  category: 'logement' | 'services' | 'transport' | 'alimentation' | 'sante' | 'loisirs' | 'epargne' | 'divers';
  subcategory: string;
  description: string;
  amount: number;
  frequency: 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'annually' | 'seasonal';
  paymentDate?: number; // Jour du mois (1-31)
  seasonalMonths?: number[]; // Mois pour les dépenses saisonnières
  isActive: boolean;
  isFixed: boolean; // Fixe ou variable
  notes?: string;
}

interface MortgageInfo {
  amount: number;
  frequency: 'weekly' | 'biweekly' | 'monthly';
  paymentDate: number;
  startDate: string;
  isActive: boolean;
}

interface BudgetData {
  currentBalance: number;
  balanceDate: string;
  expenses: ExpenseEntry[];
  mortgage?: MortgageInfo;
  savingsGoal: number;
  emergencyFund: number;
}

const Budget: React.FC = () => {
  const { language } = useLanguage();
  const { userData, updateUserData } = useRetirementData();
  const { user } = useAuth();
  const { appliedCode } = usePromoCode();
  const isFrench = language === 'fr';

  const [budgetData, setBudgetData] = useState<BudgetData>({
    currentBalance: 0,
    balanceDate: new Date().toISOString().split('T')[0],
    expenses: [],
    savingsGoal: 0,
    emergencyFund: 0
  });

  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  // Vérifier l'accès au Module Budget avec considération des codes promo
  const userPlan = user?.subscription?.plan || 'free';
  const effectivePlan = PromoCodeService.getEffectivePlan(userPlan, appliedCode || '');
  const hasAccess = checkFeatureAccess('hasBudgetModule', effectivePlan);
  const requiredPlan = getRequiredPlanForFeature('hasBudgetModule');
  
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [editingExpense, setEditingExpense] = useState<string | null>(null);
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);

  // Catégories de dépenses avec icônes senior
  const expenseCategories = [
    {
      value: 'logement',
      label: 'Logement',
      icon: '🏠',
      subcategories: [
        'Hypothèque/Loyer', 'Taxes municipales', 'Assurance habitation', 
        'Entretien', 'Réparations', 'Amélioration'
      ]
    },
    {
      value: 'services',
      label: 'Services publics',
      icon: '⚡',
      subcategories: [
        'Électricité', 'Gaz naturel', 'Eau', 'Internet', 'Téléphone', 
        'Câble/Diffusion', 'Déneigement', 'Ordures'
      ]
    },
    {
      value: 'transport',
      label: 'Transport',
      icon: '🚗',
      subcategories: [
        'Paiement auto', 'Essence', 'Assurance auto', 'Entretien', 
        'Réparations', 'Immatriculation', 'Transport public', 'Stationnement'
      ]
    },
    {
      value: 'alimentation',
      label: 'Alimentation',
      icon: '🍽️',
      subcategories: [
        'Épicerie', 'Restaurants', 'Livraison', 'Café', 'Alcool', 'Suppléments'
      ]
    },
    {
      value: 'sante',
      label: 'Santé',
      icon: '❤️',
      subcategories: [
        'Assurance santé', 'Médicaments', 'Dentiste', 'Optométriste', 
        'Physiothérapie', 'Gym', 'Massothérapie'
      ]
    },
    {
      value: 'loisirs',
      label: 'Loisirs',
      icon: '🎯',
      subcategories: [
        'Sorties', 'Cinéma', 'Concerts', 'Voyages', 'Passe-temps', 
        'Livres', 'Jeux', 'Abonnements'
      ]
    },
    {
      value: 'epargne',
      label: 'Épargne',
      icon: '🐷',
      subcategories: [
        'REER', 'CELI', 'Épargne urgence', 'Placements', 'Objectifs', 'Retraite'
      ]
    },
    {
      value: 'divers',
      label: 'Divers',
      icon: '🛒',
      subcategories: [
        'Vêtements', 'Cadeaux', 'Dons', 'Frais bancaires', 'Impôts', 
        'Assurance vie', 'Frais professionnels', 'Autres'
      ]
    }
  ];

  // Fréquences de paiement
  const frequencies = [
    { value: 'weekly', label: 'Chaque semaine', multiplier: 52 },
    { value: 'biweekly', label: 'Aux 2 semaines', multiplier: 26 },
    { value: 'monthly', label: 'Chaque mois', multiplier: 12 },
    { value: 'quarterly', label: 'Aux 3 mois', multiplier: 4 },
    { value: 'annually', label: 'Une fois par an', multiplier: 1 },
    { value: 'seasonal', label: 'Selon la saison', multiplier: 1 }
  ];

  // Obtenir les revenus depuis le tableau unifié
  const getIncomeData = () => {
    const unifiedIncome1 = (userData.personal as any)?.unifiedIncome1 || [];
    const unifiedIncome2 = (userData.personal as any)?.unifiedIncome2 || [];
    
    return IncomeIntegrationService.convertToFinancialAssistantFormat(
      unifiedIncome1,
      unifiedIncome2
    );
  };

  const incomeData = getIncomeData();

  // Calculer les dépenses mensuelles
  const calculateMonthlyExpenses = () => {
    let total = 0;
    
    budgetData.expenses.forEach(expense => {
      if (!expense.isActive) return;
      
      const freq = frequencies.find(f => f.value === expense.frequency);
      if (!freq) return;
      
      if (expense.frequency === 'seasonal') {
        total += expense.amount / 12;
      } else {
        total += (expense.amount * freq.multiplier) / 12;
      }
    });
    
    // Ajouter l'hypothèque
    if (budgetData.mortgage?.isActive) {
      const mortgageFreq = frequencies.find(f => f.value === budgetData.mortgage!.frequency);
      if (mortgageFreq) {
        total += (budgetData.mortgage.amount * mortgageFreq.multiplier) / 12;
      }
    }
    
    return total;
  };

  // Calculer le flux de trésorerie net
  const calculateNetCashFlow = () => {
    const monthlyIncome = incomeData.monthlyIncome;
    const monthlyExpenses = calculateMonthlyExpenses();
    return monthlyIncome - monthlyExpenses;
  };

  // Ajouter une nouvelle dépense
  const addExpense = () => {
    const newExpense: ExpenseEntry = {
      id: `expense-${Date.now()}`,
      category: 'divers',
      subcategory: 'Autres',
      description: '',
      amount: 0,
      frequency: 'monthly',
      paymentDate: 1,
      isActive: true,
      isFixed: true
    };

    setBudgetData(prev => ({
      ...prev,
      expenses: [...prev.expenses, newExpense]
    }));

    setEditingExpense(newExpense.id);
    setShowAddExpense(false);
  };

  // Mettre à jour une dépense
  const updateExpense = (id: string, updates: Partial<ExpenseEntry>) => {
    setBudgetData(prev => ({
      ...prev,
      expenses: prev.expenses.map(expense =>
        expense.id === id ? { ...expense, ...updates } : expense
      )
    }));
  };

  // Supprimer une dépense
  const removeExpense = (id: string) => {
    setBudgetData(prev => ({
      ...prev,
      expenses: prev.expenses.filter(expense => expense.id !== id)
    }));
  };

  // Formater la devise
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-CA', {
      style: 'currency',
      currency: 'CAD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Obtenir la couleur selon le montant (positif/négatif)
  const getAmountColor = (amount: number) => {
    if (amount > 0) return 'senior-text-success';
    if (amount < 0) return 'senior-text-error';
    return 'senior-text-secondary';
  };

  // Sauvegarder les données
  const handleSave = async () => {
    setIsSaving(true);
    try {
      updateUserData('personal', { budgetData } as any);
      
      const result = await EnhancedSaveManager.saveDirectly(userData, {
        includeTimestamp: true
      });
      
      if (result.success) {
        console.log('💾 Budget sauvegardé avec succès:', result.filename);
      }
    } catch (error) {
      console.error('❌ Erreur lors de la sauvegarde du budget:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Charger les données au montage
  useEffect(() => {
    const savedBudgetData = (userData.personal as any)?.budgetData;
    if (savedBudgetData) {
      setBudgetData(savedBudgetData);
    }
  }, [userData]);

  const monthlyExpenses = calculateMonthlyExpenses();
  const netCashFlow = calculateNetCashFlow();

  // Si l'utilisateur n'a pas accès, afficher le message d'amélioration
  if (!hasAccess) {
    return (
      <div className="senior-layout">
        <div className="senior-card">
          <div className="senior-card-header">
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <span style={{ fontSize: '4rem' }}>🐷</span>
            </div>
            <h1 className="senior-card-title">Outil de budget personnel</h1>
            <p style={{ color: 'var(--senior-text-secondary)', fontSize: '18px', textAlign: 'center', margin: '1rem 0' }}>
              Cette fonctionnalité est réservée aux plans Professionnel et Expert.
            </p>
          </div>
          
          <div style={{ 
            backgroundColor: 'var(--senior-bg-accent)', 
            padding: '1.5rem', 
            borderRadius: '8px',
            border: '2px solid var(--senior-warning)',
            margin: '2rem 0'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <span style={{ fontSize: '2rem' }}>⚠️</span>
              <strong style={{ color: 'var(--senior-text-primary)', fontSize: '18px' }}>
                Accès limité
              </strong>
            </div>
            <p style={{ color: 'var(--senior-text-primary)', fontSize: '18px' }}>
              {getContextualUpgradeMessage(userPlan, requiredPlan)}
            </p>
          </div>

          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <button 
              onClick={() => setShowUpgradeModal(true)}
              className="senior-btn senior-btn-primary"
              style={{ fontSize: '18px', padding: '1rem 2rem' }}
            >
              Améliorer mon compte maintenant
            </button>
          </div>
        </div>

        <AdvancedUpgradeModal
          isOpen={showUpgradeModal}
          onClose={() => setShowUpgradeModal(false)}
          requiredPlan={requiredPlan}
          featureName="hasBudgetModule"
          currentPlan={userPlan}
          subscriptionStartDate={user?.subscription?.startDate}
        />
      </div>
    );
  }

  return (
    <div className="senior-layout">
      {/* En-tête principal */}
      <div className="senior-card">
        <div className="senior-card-header" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>💰</div>
          <h1 className="senior-card-title" style={{ fontSize: '32px', color: 'var(--senior-primary)' }}>
            Mon budget personnel
          </h1>
          <p style={{ 
            color: 'var(--senior-text-secondary)', 
            fontSize: '18px', 
            maxWidth: '600px', 
            margin: '1rem auto',
            lineHeight: '1.6'
          }}>
            Gérez vos revenus et dépenses en toute simplicité avec notre outil facile à utiliser
          </p>
        </div>
      </div>

      {/* Résumé financier */}
      <div className="senior-financial-summary">
        <h2 className="senior-financial-total" style={{ fontSize: '24px', marginBottom: '2rem', textAlign: 'center' }}>
          Votre situation financière mensuelle
        </h2>
        
        <div className="senior-financial-grid">
          <div className="senior-financial-card" style={{ backgroundColor: 'var(--senior-success)' }}>
            <div className="senior-financial-title" style={{ color: 'white' }}>
              <span style={{ fontSize: '2rem' }}>💵</span>
              <span style={{ fontSize: '20px', fontWeight: 'bold' }}>Revenus mensuels</span>
            </div>
            <div className="senior-financial-item" style={{ justifyContent: 'center' }}>
              <strong style={{ fontSize: '28px', color: 'white' }}>
                {formatCurrency(incomeData.monthlyIncome)}
              </strong>
            </div>
          </div>

          <div className="senior-financial-card" style={{ backgroundColor: 'var(--senior-error)' }}>
            <div className="senior-financial-title" style={{ color: 'white' }}>
              <span style={{ fontSize: '2rem' }}>💸</span>
              <span style={{ fontSize: '20px', fontWeight: 'bold' }}>Dépenses mensuelles</span>
            </div>
            <div className="senior-financial-item" style={{ justifyContent: 'center' }}>
              <strong style={{ fontSize: '28px', color: 'white' }}>
                {formatCurrency(monthlyExpenses)}
              </strong>
            </div>
          </div>

          <div className="senior-financial-card" style={{ 
            backgroundColor: netCashFlow >= 0 ? 'var(--senior-success)' : 'var(--senior-error)' 
          }}>
            <div className="senior-financial-title" style={{ color: 'white' }}>
              <span style={{ fontSize: '2rem' }}>📊</span>
              <span style={{ fontSize: '20px', fontWeight: 'bold' }}>Argent restant</span>
            </div>
            <div className="senior-financial-item" style={{ justifyContent: 'center' }}>
              <strong style={{ fontSize: '28px', color: 'white' }}>
                {formatCurrency(netCashFlow)}
              </strong>
            </div>
          </div>

          <div className="senior-financial-card" style={{ backgroundColor: 'var(--senior-primary)' }}>
            <div className="senior-financial-title" style={{ color: 'white' }}>
              <span style={{ fontSize: '2rem' }}>🏦</span>
              <span style={{ fontSize: '20px', fontWeight: 'bold' }}>Solde actuel</span>
            </div>
            <div className="senior-financial-item" style={{ justifyContent: 'center' }}>
              <strong style={{ fontSize: '28px', color: 'white' }}>
                {formatCurrency(budgetData.currentBalance)}
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* Alerte budgétaire */}
      {netCashFlow < 0 && (
        <div style={{ 
          backgroundColor: 'var(--senior-bg-accent)', 
          padding: '1.5rem', 
          borderRadius: '8px',
          border: '2px solid var(--senior-error)',
          margin: '2rem 0'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <span style={{ fontSize: '2rem' }}>⚠️</span>
            <strong style={{ color: 'var(--senior-error)', fontSize: '20px' }}>
              Attention - Budget en déficit
            </strong>
          </div>
          <p style={{ color: 'var(--senior-text-primary)', fontSize: '18px', lineHeight: '1.6' }}>
            Vos dépenses dépassent vos revenus de <strong>{formatCurrency(Math.abs(netCashFlow))}</strong> chaque mois. 
            Il serait sage de réviser vos dépenses ou trouver des revenus supplémentaires.
          </p>
        </div>
      )}

      {/* Navigation principale */}
      <nav className="senior-nav">
        <h2 style={{ fontSize: '24px', textAlign: 'center', margin: '2rem 0', color: 'var(--senior-primary)' }}>
          Choisissez une section
        </h2>
        <div className="senior-nav-grid">
          <div className="senior-nav-item" onClick={() => setSelectedSection('expenses')} style={{ cursor: 'pointer' }}>
            <div className="senior-nav-icon">💸</div>
            <div className="senior-nav-content">
              <h3 className="senior-nav-title">Mes dépenses</h3>
              <p className="senior-nav-description">Ajouter et gérer toutes vos dépenses mensuelles</p>
            </div>
          </div>
          
          <div className="senior-nav-item" onClick={() => setSelectedSection('settings')} style={{ cursor: 'pointer' }}>
            <div className="senior-nav-icon">⚙️</div>
            <div className="senior-nav-content">
              <h3 className="senior-nav-title">Mes informations</h3>
              <p className="senior-nav-description">Mettre à jour votre solde bancaire et objectifs</p>
            </div>
          </div>

          <div className="senior-nav-item" onClick={() => setSelectedSection('overview')} style={{ cursor: 'pointer' }}>
            <div className="senior-nav-icon">📊</div>
            <div className="senior-nav-content">
              <h3 className="senior-nav-title">Vue d'ensemble</h3>
              <p className="senior-nav-description">Voir le résumé de vos finances et prévisions</p>
            </div>
          </div>
        </div>
      </nav>

      {/* État de section sélectionnée */}
      {!selectedSection && (
        <div className="senior-card" style={{ textAlign: 'center', margin: '2rem 0' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👆</div>
          <p style={{ fontSize: '20px', color: 'var(--senior-text-secondary)' }}>
            Cliquez sur une section ci-dessus pour commencer
          </p>
        </div>
      )}

      {/* Vue d'ensemble */}
      {selectedSection === 'overview' && (
        <div className="senior-card">
          <div className="senior-card-header">
            <h2 className="senior-card-title">Vue d'ensemble de vos finances</h2>
            <button 
              onClick={() => setSelectedSection(null)}
              className="senior-btn senior-btn-secondary"
              style={{ fontSize: '16px', padding: '0.5rem 1rem' }}
            >
              ← Retour au menu
            </button>
          </div>
          
          <div style={{ display: 'grid', gap: '2rem', marginBottom: '2rem' }}>
            {/* Dépenses par catégorie */}
            <div style={{ backgroundColor: 'var(--senior-bg-secondary)', padding: '1.5rem', borderRadius: '8px' }}>
              <h3 style={{ fontSize: '20px', marginBottom: '1rem', color: 'var(--senior-primary)' }}>
                📊 Vos dépenses par catégorie
              </h3>
              <div style={{ display: 'grid', gap: '1rem' }}>
                {expenseCategories.map(category => {
                  const categoryExpenses = budgetData.expenses
                    .filter(e => e.isActive && e.category === category.value)
                    .reduce((sum, e) => {
                      const freq = frequencies.find(f => f.value === e.frequency);
                      if (!freq) return sum;
                      return sum + (e.frequency === 'seasonal' ? e.amount / 12 : (e.amount * freq.multiplier) / 12);
                    }, 0);

                  const percentage = monthlyExpenses > 0 ? (categoryExpenses / monthlyExpenses) * 100 : 0;

                  return (
                    <div key={category.value} style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      padding: '1rem',
                      backgroundColor: 'var(--senior-bg-card)',
                      borderRadius: '6px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <span style={{ fontSize: '1.5rem' }}>{category.icon}</span>
                        <span style={{ fontSize: '18px', color: 'var(--senior-text-primary)' }}>
                          {category.label}
                        </span>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--senior-text-primary)' }}>
                          {formatCurrency(categoryExpenses)}
                        </div>
                        <div style={{ fontSize: '16px', color: 'var(--senior-text-secondary)' }}>
                          {percentage.toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Prévisions */}
            <div style={{ backgroundColor: 'var(--senior-bg-secondary)', padding: '1.5rem', borderRadius: '8px' }}>
              <h3 style={{ fontSize: '20px', marginBottom: '1rem', color: 'var(--senior-primary)' }}>
                🔮 Prévisions de votre argent
              </h3>
              <div style={{ display: 'grid', gap: '1rem' }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  padding: '1rem',
                  backgroundColor: 'var(--senior-bg-card)',
                  borderRadius: '6px'
                }}>
                  <span style={{ fontSize: '18px', color: 'var(--senior-text-primary)' }}>Dans 3 mois</span>
                  <strong style={{ fontSize: '20px' }} className={getAmountColor(budgetData.currentBalance + (netCashFlow * 3))}>
                    {formatCurrency(budgetData.currentBalance + (netCashFlow * 3))}
                  </strong>
                </div>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  padding: '1rem',
                  backgroundColor: 'var(--senior-bg-card)',
                  borderRadius: '6px'
                }}>
                  <span style={{ fontSize: '18px', color: 'var(--senior-text-primary)' }}>Dans 6 mois</span>
                  <strong style={{ fontSize: '20px' }} className={getAmountColor(budgetData.currentBalance + (netCashFlow * 6))}>
                    {formatCurrency(budgetData.currentBalance + (netCashFlow * 6))}
                  </strong>
                </div>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  padding: '1rem',
                  backgroundColor: 'var(--senior-bg-card)',
                  borderRadius: '6px'
                }}>
                  <span style={{ fontSize: '18px', color: 'var(--senior-text-primary)' }}>Dans 1 an</span>
                  <strong style={{ fontSize: '20px' }} className={getAmountColor(budgetData.currentBalance + (netCashFlow * 12))}>
                    {formatCurrency(budgetData.currentBalance + (netCashFlow * 12))}
                  </strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Gestion des dépenses */}
      {selectedSection === 'expenses' && (
        <div className="senior-card">
          <div className="senior-card-header">
            <h2 className="senior-card-title">Gérer vos dépenses mensuelles</h2>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <button 
                onClick={() => setSelectedSection(null)}
                className="senior-btn senior-btn-secondary"
                style={{ fontSize: '16px', padding: '0.5rem 1rem' }}
              >
                ← Retour au menu
              </button>
              <button
                onClick={addExpense}
                className="senior-btn senior-btn-primary"
                style={{ fontSize: '18px', padding: '0.75rem 1.5rem' }}
              >
                ➕ Ajouter une dépense
              </button>
            </div>
          </div>
          
          {budgetData.expenses.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📝</div>
              <p style={{ fontSize: '20px', color: 'var(--senior-text-secondary)', marginBottom: '2rem' }}>
                Vous n'avez pas encore ajouté de dépenses
              </p>
              <button
                onClick={addExpense}
                className="senior-btn senior-btn-primary"
                style={{ fontSize: '18px', padding: '1rem 2rem' }}
              >
                Ajouter votre première dépense
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '1rem' }}>
              {budgetData.expenses.map(expense => {
                const category = expenseCategories.find(c => c.value === expense.category);
                const isEditing = editingExpense === expense.id;

                return (
                  <div key={expense.id} className="senior-card" style={{ padding: '1.5rem' }}>
                    {isEditing ? (
                      // Mode édition avec formulaire horizontal
                      <div style={{ display: 'grid', gap: '1rem' }}>
                        <h3 style={{ fontSize: '20px', color: 'var(--senior-primary)', marginBottom: '1rem' }}>
                          ✏️ Modifier cette dépense
                        </h3>
                        
                        <div className="senior-form-field">
                          <label className="senior-form-label">Type de dépense</label>
                          <select
                            value={expense.category}
                            onChange={(e) => updateExpense(expense.id, { category: e.target.value as any })}
                            className="senior-form-input"
                            style={{ fontSize: '18px' }}
                          >
                            {expenseCategories.map(cat => (
                              <option key={cat.value} value={cat.value}>
                                {cat.icon} {cat.label}
                              </option>
                            ))}
                          </select>
                          <div className="senior-form-tooltip" title="Choisissez la catégorie qui correspond le mieux à cette dépense">
                            ?
                          </div>
                        </div>

                        <div className="senior-form-field">
                          <label className="senior-form-label">Description</label>
                          <input
                            type="text"
                            value={expense.description}
                            onChange={(e) => updateExpense(expense.id, { description: e.target.value })}
                            className="senior-form-input"
                            placeholder="Ex: Épicerie Metro"
                            style={{ fontSize: '18px' }}
                          />
                          <div className="senior-form-tooltip" title="Donnez un nom simple et clair à cette dépense">
                            ?
                          </div>
                        </div>

                        <div className="senior-form-field">
                          <label className="senior-form-label">Montant en dollars</label>
                          <MoneyInput
                            value={expense.amount}
                            onChange={(value) => updateExpense(expense.id, { amount: value })}
                            className="senior-form-input"
                            placeholder="0"
                            allowDecimals={true}
                            style={{ fontSize: '18px' }}
                          />
                          <div className="senior-form-tooltip" title="Montant que vous payez à chaque fois">
                            ?
                          </div>
                        </div>

                        <div className="senior-form-field">
                          <label className="senior-form-label">Fréquence de paiement</label>
                          <select
                            value={expense.frequency}
                            onChange={(e) => updateExpense(expense.id, { frequency: e.target.value as any })}
                            className="senior-form-input"
                            style={{ fontSize: '18px' }}
                          >
                            {frequencies.map(freq => (
                              <option key={freq.value} value={freq.value}>
                                {freq.label}
                              </option>
                            ))}
                          </select>
                          <div className="senior-form-tooltip" title="À quelle fréquence payez-vous cette dépense?">
                            ?
                          </div>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                          <button
                            onClick={() => setEditingExpense(null)}
                            className="senior-btn senior-btn-primary"
                            style={{ fontSize: '18px', padding: '0.75rem 1.5rem' }}
                          >
                            ✅ Sauvegarder
                          </button>
                          <button
                            onClick={() => setEditingExpense(null)}
                            className="senior-btn senior-btn-secondary"
                            style={{ fontSize: '18px', padding: '0.75rem 1.5rem' }}
                          >
                            ❌ Annuler
                          </button>
                        </div>
                      </div>
                    ) : (
                      // Mode affichage
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <span style={{ fontSize: '2rem' }}>{category?.icon}</span>
                            <div>
                              <h3 style={{ fontSize: '20px', color: 'var(--senior-text-primary)', margin: 0 }}>
                                {expense.description}
                              </h3>
                              <p style={{ fontSize: '18px', color: 'var(--senior-text-secondary)', margin: 0 }}>
                                {category?.label}
                              </p>
                            </div>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--senior-primary)' }}>
                              {formatCurrency(expense.amount)}
                            </div>
                            <div style={{ fontSize: '18px', color: 'var(--senior-text-secondary)' }}>
                              {frequencies.find(f => f.value === expense.frequency)?.label}
                            </div>
                          </div>
                        </div>
                        
                        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                          <button
                            onClick={() => setEditingExpense(expense.id)}
                            className="senior-btn senior-btn-secondary"
                            style={{ fontSize: '16px', padding: '0.5rem 1rem' }}
                          >
                            ✏️ Modifier
                          </button>
                          <button
                            onClick={() => updateExpense(expense.id, { isActive: !expense.isActive })}
                            className="senior-btn"
                            style={{ 
                              fontSize: '16px', 
                              padding: '0.5rem 1rem',
                              backgroundColor: expense.isActive ? 'var(--senior-success)' : 'var(--senior-secondary)',
                              color: 'white'
                            }}
                          >
                            {expense.isActive ? '✅ Actif' : '⏸️ Inactif'}
                          </button>
                          <button
                            onClick={() => removeExpense(expense.id)}
                            className="senior-btn"
                            style={{ 
                              fontSize: '16px', 
                              padding: '0.5rem 1rem',
                              backgroundColor: 'var(--senior-error)',
                              color: 'white'
                            }}
                          >
                            🗑️ Supprimer
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Paramètres */}
      {selectedSection === 'settings' && (
        <div className="senior-card">
          <div className="senior-card-header">
            <h2 className="senior-card-title">Vos informations bancaires</h2>
            <button 
              onClick={() => setSelectedSection(null)}
              className="senior-btn senior-btn-secondary"
              style={{ fontSize: '16px', padding: '0.5rem 1rem' }}
            >
              ← Retour au menu
            </button>
          </div>
          
          <div style={{ display: 'grid', gap: '2rem' }}>
            {/* Solde bancaire */}
            <div style={{ backgroundColor: 'var(--senior-bg-secondary)', padding: '1.5rem', borderRadius: '8px' }}>
              <h3 style={{ fontSize: '20px', marginBottom: '1.5rem', color: 'var(--senior-primary)' }}>
                🏦 Votre solde bancaire actuel
              </h3>
              
              <div className="senior-form-field">
                <label className="senior-form-label">Combien avez-vous dans votre compte</label>
                <MoneyInput
                  value={budgetData.currentBalance}
                  onChange={(value) => setBudgetData(prev => ({ ...prev, currentBalance: value }))}
                  className="senior-form-input"
                  placeholder="0"
                  allowDecimals={true}
                  style={{ fontSize: '18px' }}
                />
                <div className="senior-form-tooltip" title="Le montant total d'argent dans votre compte bancaire principal">
                  ?
                </div>
              </div>
              
              <div className="senior-form-field">
                <label className="senior-form-label">À quelle date avez-vous vérifié ce montant</label>
                <DateInput
                  value={budgetData.balanceDate}
                  onChange={(value) => setBudgetData(prev => ({ ...prev, balanceDate: value }))}
                  className="senior-form-input"
                  style={{ fontSize: '18px' }}
                />
                <div className="senior-form-tooltip" title="La date où vous avez confirmé ce solde bancaire">
                  ?
                </div>
              </div>
            </div>

            {/* Objectifs d'épargne */}
            <div style={{ backgroundColor: 'var(--senior-bg-secondary)', padding: '1.5rem', borderRadius: '8px' }}>
              <h3 style={{ fontSize: '20px', marginBottom: '1.5rem', color: 'var(--senior-primary)' }}>
                🎯 Vos objectifs d'épargne
              </h3>
              
              <div className="senior-form-field">
                <label className="senior-form-label">Combien voulez-vous épargner chaque mois</label>
                <MoneyInput
                  value={budgetData.savingsGoal}
                  onChange={(value) => setBudgetData(prev => ({ ...prev, savingsGoal: value }))}
                  className="senior-form-input"
                  placeholder="0"
                  allowDecimals={true}
                  style={{ fontSize: '18px' }}
                />
                <div className="senior-form-tooltip" title="Le montant que vous aimeriez mettre de côté chaque mois">
                  ?
                </div>
              </div>
              
              <div className="senior-form-field">
                <label className="senior-form-label">Objectif pour votre fonds d'urgence</label>
                <MoneyInput
                  value={budgetData.emergencyFund}
                  onChange={(value) => setBudgetData(prev => ({ ...prev, emergencyFund: value }))}
                  className="senior-form-input"
                  placeholder="0"
                  allowDecimals={true}
                  style={{ fontSize: '18px' }}
                />
                <div className="senior-form-tooltip" title="Combien d'argent vous voulez avoir en réserve pour les urgences">
                  ?
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bouton de sauvegarde global */}
      <div style={{ textAlign: 'center', margin: '3rem 0' }}>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="senior-btn senior-btn-primary"
          style={{ 
            fontSize: '20px', 
            padding: '1rem 2rem',
            minHeight: '60px',
            minWidth: '200px'
          }}
        >
          {isSaving ? '💾 Sauvegarde en cours...' : '💾 Sauvegarder mon budget'}
        </button>
        <p style={{ 
          color: 'var(--senior-text-secondary)', 
          fontSize: '18px', 
          marginTop: '1rem' 
        }}>
          Votre budget sera sauvegardé en sécurité
        </p>
      </div>
    </div>
  );
};

export default Budget;
