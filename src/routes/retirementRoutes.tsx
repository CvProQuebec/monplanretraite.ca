import React from 'react';
import { Route } from 'react-router-dom';
import { LocalizedRoute } from './LocalizedRoute';

// Pages / Components (lazy to preserve chunking as in App.tsx)
const PlanificationUrgence = React.lazy(() => import('../pages/PlanificationUrgence'));
const PlanificationSuccessorale = React.lazy(() => import('../pages/PlanificationSuccessorale'));
const EstatePlanning = React.lazy(() => import('../pages/EstatePlanning'));
const PlanificationDepenses = React.lazy(() => import('../pages/PlanificationDepenses'));
const SpendingPlanningEn = React.lazy(() => import('../pages/SpendingPlanning'));
const AssistantFinancier = React.lazy(() => import('../pages/AssistantFinancier'));
const FinancialAssistantEn = React.lazy(() => import('../pages/FinancialAssistant'));
const SeniorsGuidedExperience = React.lazy(() => import('../components/SeniorsGuidedExperience'));
const SimpleAssumptionsPage = React.lazy(() => import('../pages/SimpleAssumptionsPage'));

const DynamicWithdrawalPlanningModule = React.lazy(
  () => import('../components/ui/DynamicWithdrawalPlanningModule')
);
const ApplyWithdrawalOrder = React.lazy(() => import('../pages/ApplyWithdrawalOrder'));
const RetirementWithdrawalComparison = React.lazy(() =>
  import('../features/retirement/components/RetirementWithdrawalComparison').then((m) => ({
    default: m.RetirementWithdrawalComparison
  }))
);
const ApplyNotification = React.lazy(() => import('../pages/ApplyNotification'));
const NotificationsPage = React.lazy(() => import('../pages/NotificationsPage'));

const RealEstateOptimizationSection = React.lazy(() =>
  import('../features/retirement/components/RealEstateOptimizationSection').then((m) => ({
    default: m.RealEstateOptimizationSection
  }))
);
const ImmobilierPage = React.lazy(() => import('../pages/ImmobilierPage'));
const RealEstatePageEn = React.lazy(() => import('../pages/RealEstatePage'));

const MonteCarloSimulator = React.lazy(() =>
  import('../features/retirement/components/optimization/MonteCarloSimulator').then((m) => ({
    default: m.MonteCarloSimulator
  }))
);
const RRQQuickCompare = React.lazy(() =>
  import('../features/retirement/components/RRQQuickCompare').then((m) => ({
    default: m.default
  }))
);
const RRQDelaySimulator = React.lazy(() =>
  import('../features/retirement/components/RRQDelaySimulator').then((m) => ({
    default: m.default
  }))
);
const SensitivityAnalysis = React.lazy(() =>
  import('../features/retirement/components/SensitivityAnalysis').then((m) => ({
    default: m.SensitivityAnalysis
  }))
);
const ScenarioComparison = React.lazy(() =>
  import('../features/retirement/components/ScenarioComparison').then((m) => ({
    default: m.ScenarioComparison
  }))
);

const TaxOptimizationDashboard = React.lazy(() =>
  import('../features/retirement/components/TaxOptimizationDashboard').then((m) => ({
    default: m.TaxOptimizationDashboard
  }))
);
const UltimatePlanningDashboard = React.lazy(() =>
  import('../features/retirement/components/UltimatePlanningDashboard').then((m) => ({
    default: m.UltimatePlanningDashboard
  }))
);

const ExpensesPage = React.lazy(() => import('../pages/ExpensesPage'));

/**
 * RetirementRoutes
 * Regroupe les routes fonctionnelles du domaine retraite/budget/notifications.
 * Aucune logique métier modifiée (extraction pure depuis App.tsx).
 */
export function RetirementRoutes() {
  return (
    <>
      {/* Urgence */}
      {LocalizedRoute({ fr: "/planification-urgence", en: "/emergency-planning", component: PlanificationUrgence })}

      {/* Successorale (FR) / Estate planning (EN) — composants distincts */}
      <Route path="/planification-successorale" element={<PlanificationSuccessorale />} />
      <Route path="/succession-planning" element={<EstatePlanning />} />

      {/* Dépenses planification (FR/EN) — composants distincts */}
      <Route path="/planification-depenses" element={<PlanificationDepenses />} />
      <Route path="/expense-planning" element={<SpendingPlanningEn />} />

      {/* Assistants (FR/EN) — composants distincts */}
      <Route path="/assistant-financier" element={<AssistantFinancier />} />
      <Route path="/financial-assistant" element={<FinancialAssistantEn />} />

      {/* Expérience guidée (même composant) */}
      {LocalizedRoute({ fr: "/experience-guidee", en: "/guided-experience", component: SeniorsGuidedExperience })}

      {/* Hypothèses de calcul */}
      {LocalizedRoute({ fr: "/hypotheses", en: "/assumptions", component: SimpleAssumptionsPage })}
      {LocalizedRoute({ fr: "/hypotheses-calcul", en: "/calculation-assumptions", component: SimpleAssumptionsPage })}

      {/* Retraits */}
      {LocalizedRoute({ fr: "/sequence-retrait", en: "/withdrawal-sequence", component: DynamicWithdrawalPlanningModule })}
      {LocalizedRoute({ fr: "/retraits/apply", en: "/withdrawals/apply", component: ApplyWithdrawalOrder })}
      {LocalizedRoute({ fr: "/comparateur-retraits", en: "/withdrawal-comparison", component: RetirementWithdrawalComparison })}

      {/* Notifications */}
      <Route path="/notifications/apply" element={<ApplyNotification />} />
      {LocalizedRoute({ fr: "/rappels", en: "/notifications", component: NotificationsPage })}

      {/* Optimisation immobilière */}
      {LocalizedRoute({
        fr: "/optimisation-immobiliere",
        en: "/real-estate-optimization",
        component: RealEstateOptimizationSection,
        elementProps: { userPlan: "professional" }
      })}

      {/* Immobilier (pages distinctes FR/EN) */}
      <Route path="/immobilier" element={<ImmobilierPage />} />
      <Route path="/real-estate" element={<RealEstatePageEn />} />

      {/* Simulations */}
      {LocalizedRoute({ fr: "/simulateur-monte-carlo", en: "/monte-carlo-simulator", component: MonteCarloSimulator })}
      <Route path="/rrq-quick-compare" element={<RRQQuickCompare />} />
      <Route path="/rrq-delay-simulator" element={<RRQDelaySimulator />} />
      {LocalizedRoute({ fr: "/analyse-sensibilite", en: "/sensitivity-analysis", component: SensitivityAnalysis })}
      {LocalizedRoute({ fr: "/comparaison-scenarios", en: "/scenario-comparison", component: ScenarioComparison })}

      {/* Optimisation fiscale / Planification expert */}
      {LocalizedRoute({ fr: "/optimisation-fiscale", en: "/tax-optimization", component: TaxOptimizationDashboard })}
      {LocalizedRoute({ fr: "/planification-expert", en: "/expert-planning", component: UltimatePlanningDashboard })}

      {/* Dépenses (Budget - accès direct) */}
      {LocalizedRoute({ fr: "/depenses", en: "/expenses", component: ExpensesPage })}
    </>
  );
}
