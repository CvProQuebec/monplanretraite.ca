/**
 * SeniorsDashboard - Tableau de Bord Statique Zéro Scroll
 * Interface principale pour seniors (50-90 ans) avec règle du 4%
 * GRILLE FIXE | AUCUN SCROLL | ASSISTANT INTÉGRÉ | CALCULS SIMPLIFIÉS
 */

import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRetirementData } from '@/features/retirement/hooks/useRetirementData';
import { SeniorsNavigationService, AssistantMessage } from '@/services/SeniorsNavigationService';
import { formatCurrency } from '@/features/retirement/utils/formatters';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  DollarSign, 
  PiggyBank, 
  Shield, 
  Home,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Info,
  Calculator,
  Target,
  Heart,
  Clock,
  Zap,
  Users,
  Eye,
  Settings,
  Bell
} from 'lucide-react';
import type { PersonalData, SavingsData, CashflowData } from '@/features/retirement/types';
import { useLanguage } from '@/hooks/useLanguage';
import { useWizardProgress } from '@/hooks/useWizardProgress';
import NotificationsPanel from '@/components/ui/NotificationsPanel';

const seniorsDashboardStyles = `
  .seniors-dashboard {
    min-height: 100vh;
    background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
    padding: 20px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    overflow: hidden;
  }

  .seniors-dashboard-container {
    max-width: 1400px;
    margin: 0 auto;
    height: calc(100vh - 40px);
    display: flex;
    flex-direction: column;
  }

  .seniors-header {
    background: white;
    border-radius: 16px;
    padding: 30px;
    margin-bottom: 20px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .seniors-header-left {
    flex: 1;
  }

  .seniors-welcome {
    font-size: 32px;
    font-weight: 700;
    color: #1a365d;
    margin-bottom: 8px;
  }

  .seniors-subtitle {
    font-size: 18px;
    color: #64748b;
  }

  .seniors-header-right {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .seniors-main-grid {
    flex: 1;
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 20px;
    overflow: hidden;
  }

  .seniors-left-column {
    display: flex;
    flex-direction: column;
    gap: 20px;
    overflow: hidden;
  }

  .seniors-right-column {
    display: flex;
    flex-direction: column;
    gap: 20px;
    overflow: hidden;
    min-height: 0; /* allow children to size; needed for inner scroll area */
  }

  .seniors-cards-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    flex: 1;
    min-height: 0;
  }

  .seniors-card {
    background: white;
    border-radius: 16px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    overflow: hidden;
    display: flex;
    flex-direction: column;
    transition: all 0.3s ease;
  }

  .seniors-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  }

  .seniors-card-header {
    padding: 25px 25px 15px 25px;
    border-bottom: 1px solid #f1f5f9;
  }

  .seniors-card-title {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 20px;
    font-weight: 700;
    color: #1a365d;
    margin-bottom: 8px;
  }

  .seniors-card-subtitle {
    font-size: 14px;
    color: #64748b;
  }

  .seniors-card-content {
    padding: 20px 25px 25px 25px;
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .seniors-metric-value {
    font-size: 36px;
    font-weight: 800;
    line-height: 1;
    margin-bottom: 8px;
  }

  .seniors-metric-label {
    font-size: 14px;
    color: #64748b;
    margin-bottom: 16px;
  }

  .seniors-metric-change {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 14px;
    font-weight: 600;
  }

  .seniors-metric-positive {
    color: #059669;
  }

  .seniors-metric-negative {
    color: #dc2626;
  }

  .seniors-metric-neutral {
    color: #64748b;
  }

  .seniors-assistant-panel {
    background: linear-gradient(135deg, #4c6ef5 0%, #6c5ce7 100%);
    border-radius: 16px;
    padding: 20px;
    color: white;
    flex: 0 0 auto;
    display: flex;
    flex-direction: column;
    max-height: 260px;
  }

  .seniors-assistant-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 20px;
  }

  .seniors-assistant-avatar {
    font-size: 32px;
  }

  .seniors-assistant-title {
    font-size: 20px;
    font-weight: 700;
  }

  .seniors-assistant-message {
    flex: 0 0 auto;
    font-size: 16px;
    line-height: 1.6;
    margin-bottom: 16px;
    max-height: 120px;
    overflow: auto;
  }

  .seniors-assistant-actions {
    display: flex;
    gap: 12px;
  }

  .seniors-assistant-btn {
    flex: 1;
    background: rgba(255, 255, 255, 0.2);
    color: white;
    border: 1px solid rgba(255, 255, 255, 0.3);
    font-weight: 600;
    min-height: 44px;
    border-radius: 8px;
    transition: all 0.2s;
  }

  .seniors-assistant-btn:hover {
    background: rgba(255, 255, 255, 0.3);
    border-color: rgba(255, 255, 255, 0.5);
  }

  .seniors-quick-actions {
    background: white;
    border-radius: 16px;
    padding: 25px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  }

  .seniors-quick-actions-title {
    font-size: 18px;
    font-weight: 700;
    color: #1a365d;
    margin-bottom: 20px;
  }

  .seniors-actions-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }

  .seniors-action-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 14px;
    background: #f8fafc;
    border: 2px solid #e2e8f0;
    border-radius: 12px;
    transition: all 0.2s;
    font-size: 14px;
    font-weight: 600;
    color: #475569;
  }

  .seniors-action-btn:hover {
    background: #e2e8f0;
    border-color: #cbd5e1;
    transform: translateY(-1px);
  }

  /* Space under "Actions rapides": let notifications take remaining height with internal scroll */
  .seniors-notifications-wrap {
    flex: 1 1 auto;
    min-height: 0;
    overflow: auto;
  }

  .seniors-status-excellent {
    color: #059669;
  }

  .seniors-status-good {
    color: #0ea5e9;
  }

  .seniors-status-warning {
    color: #ea580c;
  }

  .seniors-status-danger {
    color: #dc2626;
  }

  /* Règle du 4% spéciale */
  .seniors-four-percent-card {
    background: linear-gradient(135deg, #059669 0%, #0d9488 100%);
    color: white;
  }

  .seniors-four-percent-value {
    font-size: 28px;
    font-weight: 800;
    margin-bottom: 8px;
  }

  .seniors-four-percent-desc {
    font-size: 14px;
    opacity: 0.9;
    margin-bottom: 16px;
  }

  /* Responsive pour tablettes */
  @media (max-width: 1024px) {
    .seniors-main-grid {
      grid-template-columns: 1fr;
    }
    
    .seniors-right-column {
      order: -1;
    }
    
    .seniors-cards-grid {
      grid-template-columns: 1fr 1fr;
    }
  }

  @media (max-width: 768px) {
    .seniors-dashboard {
      padding: 10px;
    }
    
    .seniors-header {
      flex-direction: column;
      gap: 20px;
      text-align: center;
    }
    
    .seniors-cards-grid {
      grid-template-columns: 1fr;
    }
    
    .seniors-actions-grid {
      grid-template-columns: 1fr;
    }
    
    .seniors-welcome {
      font-size: 28px;
    }
    
    .seniors-metric-value {
      font-size: 32px;
    }
  }
`;

interface DashboardMetric {
  id: string;
  title: string;
  value: string | number;
  label: string;
  change?: {
    value: number;
    type: 'positive' | 'negative' | 'neutral';
    label: string;
  };
  status: 'excellent' | 'good' | 'warning' | 'danger';
  icon: React.ReactNode;
  onClick?: () => void;
}

interface QuickAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

export const SeniorsDashboard: React.FC = () => {
  const { userData } = useRetirementData();
  const navigate = useNavigate();
  const [assistantMessage, setAssistantMessage] = useState<AssistantMessage | null>(null);

  // Wizard progression (scenarioId: 'default' par défaut)
  const { isEnglish } = useLanguage();
  const { nextPath, progress, loading: wizardLoading, refresh } = useWizardProgress('default', isEnglish);

  // ===== CALCULS INTELLIGENTS =====
  const dashboardMetrics = useMemo((): DashboardMetric[] => {
    const personal = (userData.personal ?? ({} as Partial<PersonalData>));
    const savings = (userData.savings ?? ({} as Partial<SavingsData>));
    const cashflow = (userData.cashflow ?? ({} as Partial<CashflowData>));
    const retirement = userData.retirement || {};

    // Calcul des revenus mensuels
    const monthlyIncome = Math.round((personal.salaire1 || 0) / 12);
    
    // Calcul des épargnes totales
    const totalSavings = (savings.reer1 || 0) + (savings.celi1 || 0) + (savings.placements1 || 0);
    
    // Calcul des dépenses mensuelles
    const monthlyExpenses = (cashflow.logement || 0) + (cashflow.alimentation || 0) + (cashflow.transport || 0);
    
    // RÈGLE DU 4% - Calcul du retrait annuel sécuritaire
    const fourPercentWithdrawal = Math.round(totalSavings * 0.04);
    const fourPercentMonthly = Math.round(fourPercentWithdrawal / 12);

    // Analyse de statut
    const savingsRate = totalSavings > 0 ? Math.min((totalSavings / ((personal.salaire1 || 1) * 10)) * 100, 100) : 0;
    
    let retirementStatus: 'excellent' | 'good' | 'warning' | 'danger' = 'warning';
    if (savingsRate >= 80) retirementStatus = 'excellent';
    else if (savingsRate >= 60) retirementStatus = 'good';
    else if (savingsRate >= 30) retirementStatus = 'warning';
    else retirementStatus = 'danger';

    return [
      {
        id: 'income',
        title: 'Revenus mensuels',
        value: formatCurrency(monthlyIncome),
        label: 'Revenus d\'emploi actuels',
        change: {
          value: 5.2,
          type: 'positive',
          label: 'vs année dernière'
        },
        status: monthlyIncome > 3000 ? 'good' : 'warning',
        icon: <DollarSign size={24} />,
        onClick: () => navigate('/revenus')
      },
      {
        id: 'savings',
        title: 'Épargnes totales',
        value: formatCurrency(totalSavings),
        label: 'REER + CELI + Placements',
        change: {
          value: Math.round(savingsRate),
          type: savingsRate >= 60 ? 'positive' : savingsRate >= 30 ? 'neutral' : 'negative',
          label: '% de l\'objectif retraite'
        },
        status: retirementStatus,
        icon: <PiggyBank size={24} />,
        onClick: () => navigate('/revenus#savings')
      },
      {
        id: 'expenses',
        title: 'Dépenses mensuelles',
        value: formatCurrency(monthlyExpenses),
        label: 'Coûts de vie principaux',
        change: {
          value: monthlyIncome > 0 ? Math.round((monthlyExpenses / monthlyIncome) * 100) : 0,
          type: monthlyExpenses < monthlyIncome * 0.7 ? 'positive' : 'negative',
          label: '% du revenu mensuel'
        },
        status: monthlyExpenses < monthlyIncome * 0.7 ? 'good' : 'warning',
        icon: <Home size={24} />,
        onClick: () => navigate('/budget')
      },
      {
        id: 'four-percent',
        title: 'Règle du 4%',
        value: formatCurrency(fourPercentMonthly),
        label: 'Revenu mensuel sécuritaire à la retraite',
        change: {
          value: fourPercentWithdrawal,
          type: fourPercentMonthly >= monthlyExpenses ? 'positive' : 'negative',
          label: `${formatCurrency(fourPercentWithdrawal)} par année`
        },
        status: fourPercentMonthly >= monthlyExpenses ? 'excellent' : 'warning',
        icon: <Target size={24} />,
        onClick: () => navigate('/regle-4-pourcent')
      }
    ];
  }, [userData]);

  // ===== ACTIONS RAPIDES =====
  const quickActions: QuickAction[] = [
    {
      id: 'add-income',
      label: 'Ajouter revenus',
      icon: <DollarSign size={16} />,
      onClick: () => navigate('/revenus')
    },
    {
      id: 'plan-expenses',
      label: 'Planifier dépenses',
      icon: <Calculator size={16} />,
      onClick: () => navigate('/budget')
    },
    {
      id: 'check-benefits',
      label: 'Prestations RRQ',
      icon: <Shield size={16} />,
      onClick: () => navigate('/revenus#benefits')
    },
    {
      id: 'view-reports',
      label: 'Mes rapports',
      icon: <Eye size={16} />,
      onClick: () => navigate('/rapports-retraite-fr')
    },
    {
      id: 'notifications',
      label: 'Planifier rappels',
      icon: <Bell size={16} />,
      onClick: () => navigate('/notifications')
    }
  ];

  // ===== MESSAGE DE L'ASSISTANT =====
  useEffect(() => {
    const navigationContext = SeniorsNavigationService.getNavigationContext(userData);
    const currentStep = navigationContext.currentStep;
    
    let message = '';
    let emoji = '🤖';
    
    if (!userData.personal?.prenom1) {
      message = "Bonjour ! Commençons par créer votre profil personnalisé. Cela ne prend que 5 minutes et vous aurez un plan de retraite sur mesure.";
      emoji = '👋';
    } else if (!userData.personal?.salaire1) {
      message = `Bonjour ${userData.personal.prenom1} ! Ajoutons vos revenus pour calculer votre capacité d'épargne retraite.`;
      emoji = '💰';
    } else {
      const totalSavings = (userData.savings?.reer1 || 0) + (userData.savings?.celi1 || 0) + (userData.savings?.placements1 || 0);
      const fourPercentMonthly = Math.round((totalSavings * 0.04) / 12);
      const monthlyExpenses = (userData.cashflow?.logement || 0) + (userData.cashflow?.alimentation || 0) + (userData.cashflow?.transport || 0);
      
      if (fourPercentMonthly >= monthlyExpenses && totalSavings > 0) {
        message = `Excellente nouvelle ${userData.personal.prenom1} ! Selon la règle du 4%, vous pourriez retirer ${formatCurrency(fourPercentMonthly)}/mois de vos épargnes de façon sécuritaire. Vous êtes sur la bonne voie pour la retraite !`;
        emoji = '🎉';
      } else if (totalSavings > 0) {
        const needed = Math.round((monthlyExpenses * 12) / 0.04);
        const toSave = needed - totalSavings;
        message = `${userData.personal.prenom1}, pour couvrir vos dépenses avec la règle du 4%, vous devriez épargner encore ${formatCurrency(toSave)}. Regardons ensemble comment y arriver !`;
        emoji = '🎯';
      } else {
        message = `${userData.personal.prenom1}, commençons par ajouter vos épargnes actuelles (REER, CELI) pour voir où vous en êtes avec la règle du 4%.`;
        emoji = '🏦';
      }
    }

    setAssistantMessage({
      id: 'dashboard-message',
      type: 'guidance',
      message,
      emoji,
      priority: 'medium',
      dismissible: false
    });
  }, [userData]);

  return (
    <>
      <style>{seniorsDashboardStyles}</style>
      <div className="seniors-dashboard">
        <div className="seniors-dashboard-container">
          {/* En-tête */}
          <div className="seniors-header">
            <div className="seniors-header-left">
              <h1 className="seniors-welcome">
                {userData.personal?.prenom1 
                  ? `Bonjour ${userData.personal.prenom1} !` 
                  : 'Mon Plan Retraite'
                }
              </h1>
              <p className="seniors-subtitle">
                Votre tableau de bord personnalisé avec la règle du 4%
              </p>
            </div>
            <div className="seniors-header-right">
              <Button
                onClick={() => {
                  if (nextPath) navigate(nextPath);
                  else navigate('/budget');
                }}
                size="lg"
                className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white"
                disabled={wizardLoading}
              >
                <Zap size={18} />
                Continuer
              </Button>
              <Button
                onClick={() => navigate('/profile')}
                variant="outline"
                size="lg"
                className="flex items-center gap-2"
              >
                <Settings size={18} />
                Paramètres
              </Button>
            </div>
          </div>

          {/* Grille principale */}
          <div className="seniors-main-grid">
            {/* Colonne gauche - Métriques */}
            <div className="seniors-left-column">
              <div className="seniors-cards-grid">
                {dashboardMetrics.map((metric) => (
                  <div
                    key={metric.id}
                    className={`seniors-card ${metric.id === 'four-percent' ? 'seniors-four-percent-card' : ''}`}
                    onClick={metric.onClick}
                    style={{ cursor: metric.onClick ? 'pointer' : 'default' }}
                  >
                    <div className="seniors-card-header">
                      <div className="seniors-card-title">
                        {metric.icon}
                        {metric.title}
                      </div>
                    </div>
                    <div className="seniors-card-content">
                      <div className={`seniors-metric-value ${metric.id === 'four-percent' ? 'seniors-four-percent-value' : `seniors-status-${metric.status}`}`}>
                        {metric.value}
                      </div>
                      <div className={`seniors-metric-label ${metric.id === 'four-percent' ? 'seniors-four-percent-desc' : ''}`}>
                        {metric.label}
                      </div>
                      {metric.change && (
                        <div className={`seniors-metric-change seniors-metric-${metric.change.type}`}>
                          {metric.change.type === 'positive' && <TrendingUp size={16} />}
                          {metric.change.type === 'negative' && <TrendingDown size={16} />}
                          {metric.change.type === 'neutral' && <Info size={16} />}
                          {metric.change.value}
                          {metric.id === 'expenses' || metric.id === 'savings' ? '%' : ''} {metric.change.label}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Colonne droite - Assistant et actions */}
            <div className="seniors-right-column">
              {/* Panel de l'assistant */}
              <div className="seniors-assistant-panel">
                <div className="seniors-assistant-header">
                  <div className="seniors-assistant-avatar">
                    {assistantMessage?.emoji || '🤖'}
                  </div>
                  <div className="seniors-assistant-title">
                    Votre Assistant Financier
                  </div>
                </div>
                <div className="seniors-assistant-message">
                  {assistantMessage?.message || 'Chargement de vos conseils personnalisés...'}
                </div>
                <div className="seniors-assistant-actions">
                  <Button 
                    className="seniors-assistant-btn"
                    onClick={() => {
                      if (!userData.personal?.prenom1) {
                        navigate('/guided-experience');
                      } else {
                        navigate('/revenus');
                      }
                    }}
                  >
                    {!userData.personal?.prenom1 ? 'Commencer' : 'Voir détails'}
                  </Button>
                  <Button 
                    className="seniors-assistant-btn"
                    onClick={() => navigate('/learning')}
                  >
                    En savoir plus
                  </Button>
                </div>
              </div>

              {/* Actions rapides */}
              <div className="seniors-quick-actions">
                <h3 className="seniors-quick-actions-title">Actions rapides</h3>
                <div className="seniors-actions-grid">
                  {quickActions.map((action) => (
                    <Button
                      key={action.id}
                      onClick={action.onClick}
                      className="seniors-action-btn"
                      variant="ghost"
                    >
                      {action.icon}
                      {action.label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Notifications 90/60/30 */}
              <div className="seniors-notifications-wrap mt-4">
                <NotificationsPanel scenarioId="default" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SeniorsDashboard;
