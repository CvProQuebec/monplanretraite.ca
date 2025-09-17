import React, { useEffect, useMemo, useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Target, Shield, PiggyBank, TrendingDown, BookOpen, Link as LinkIcon } from 'lucide-react';
import { AllocationTotals } from '@/services/BudgetComputationService';
import { BudgetTargets, DebtSnowballState } from '@/types/budget';
import { formatCurrencyLocale } from '@/utils/localeFormat';
import { ExpenseEntry, SinkingFund } from '@/types/budget';

type Props = {
  language: 'fr' | 'en';
  allocations: AllocationTotals;
  targets: BudgetTargets;
  emergencyMonthsTarget?: number;
  emergencySaved?: number;
  debtState?: DebtSnowballState;
  expenses?: ExpenseEntry[];
  sinkingFunds?: SinkingFund[];
};

/**
 * ContextualTipsPanel
 * - Conseils contextualisés simples pour seniors
 * - Liens directs vers les onglets pertinents du module Budget
 * - Enregistre les lectures comme activité de "guide" (gamification)
 */
const ContextualTipsPanel: React.FC<Props> = ({
  language,
  allocations,
  targets,
  emergencyMonthsTarget = 0,
  emergencySaved = 0,
  debtState,
  expenses = [],
  sinkingFunds = []
}) => {
  const isFr = language === 'fr';

  // Dismiss for 30 days utilities
  const [version, setVersion] = useState(0);
  const isDismissed = (id: string) => {
    const raw = localStorage.getItem(`dismissed-tip-${id}`);
    if (!raw) return false;
    const ts = parseInt(raw, 10);
    return !isNaN(ts) && Date.now() - ts < 30 * 24 * 60 * 60 * 1000;
  };
  const dismiss30 = (id: string) => {
    localStorage.setItem(`dismissed-tip-${id}`, Date.now().toString());
    setVersion(v => v + 1);
  };

  // Monthly expenses from entries
  const freqMultiplier = (f: ExpenseEntry['frequency']) =>
    f === 'weekly' ? 52 :
    f === 'biweekly' ? 26 :
    f === 'monthly' ? 12 :
    f === 'quarterly' ? 4 :
    f === 'annually' ? 1 : 1;

  const monthlyFromExpenses = useMemo(() => {
    const list = (expenses || []).filter(e => e.isActive);
    let sum = 0;
    for (const e of list) {
      if (e.frequency === 'seasonal') sum += (e.amount || 0) / 12;
      else sum += ((e.amount || 0) * freqMultiplier(e.frequency)) / 12;
    }
    return sum;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expenses, version]);

  // Initialize/update a monthly baseline every 30 days
  useEffect(() => {
    try {
      const key = 'budget-baseline-monthly-expenses';
      const stored = localStorage.getItem(key);
      if (!stored) {
        localStorage.setItem(key, JSON.stringify({ value: monthlyFromExpenses, at: Date.now() }));
        return;
      }
      const obj = JSON.parse(stored);
      const THIRTY_D = 30 * 24 * 60 * 60 * 1000;
      if (!obj || !obj.at || (Date.now() - obj.at) > THIRTY_D) {
        localStorage.setItem(key, JSON.stringify({ value: monthlyFromExpenses, at: Date.now() }));
      }
    } catch {
      localStorage.setItem('budget-baseline-monthly-expenses', JSON.stringify({ value: monthlyFromExpenses, at: Date.now() }));
    }
  }, [monthlyFromExpenses]);

  const tips: Array<{
    id: string;
    icon: React.ReactNode;
    title: string;
    body: string;
    cta?: { label: string; action: () => void };
  }> = [];

  // 50/30/20 — besoins dépassent la cible de plus de 5 points
  if (allocations.pctNeeds > targets.needsPct + 5 && !isDismissed('tip-needs-high')) {
    tips.push({
      id: 'tip-needs-high',
      icon: <Target className="w-4 h-4 text-blue-700" />,
      title: isFr ? 'Vos besoins dépassent la cible' : 'Your needs exceed target',
      body: isFr
        ? `Cible besoins: ${targets.needsPct} %, réalisé: ${allocations.pctNeeds.toFixed(1)} %. Réduisez quelques dépenses essentielles ou augmentez votre revenu net.`
        : `Needs target: ${targets.needsPct}%, actual: ${allocations.pctNeeds.toFixed(1)}%. Consider trimming essential expenses or increasing net income.`,
      cta: {
        label: isFr ? 'Ajuster dépenses' : 'Adjust expenses',
        action: () => window.location.assign('?tab=expenses')
      }
    });
  }

  // Fonds d'urgence — sous la cible
  const monthlyNeeds = Math.max(0, allocations.totalNeeds || 0);
  const efTargetAmount = (emergencyMonthsTarget || 0) * monthlyNeeds;
  if (efTargetAmount > 0 && emergencySaved < efTargetAmount && !isDismissed('tip-emergency-gap')) {
    const gap = efTargetAmount - emergencySaved;
    tips.push({
      id: 'tip-emergency-gap',
      icon: <Shield className="w-4 h-4 text-emerald-700" />,
      title: isFr ? 'Fonds d’urgence sous la cible' : 'Emergency fund below target',
      body: isFr
        ? `Écart à combler: ${formatCurrencyLocale(gap, language)}. Visez ${emergencyMonthsTarget} mois de besoins essentiels.`
        : `Gap to target: ${formatCurrencyLocale(gap, language)}. Aim for ${emergencyMonthsTarget} months of essential needs.`,
      cta: {
        label: isFr ? 'Aller au fonds d’urgence' : 'Go to emergency fund',
        action: () => window.location.assign('?tab=emergency')
      }
    });
  }

  // Dettes — aucune somme "extra / mois"
  const hasActiveDebts = (debtState?.debts || []).some(d => d.isActive && (d.balance || 0) > 0);
  if (hasActiveDebts && (debtState?.extraPerMonth || 0) === 0 && !isDismissed('tip-debt-extra')) {
    tips.push({
      id: 'tip-debt-extra',
      icon: <TrendingDown className="w-4 h-4 text-rose-700" />,
      title: isFr ? 'Accélérer le remboursement des dettes' : 'Accelerate debt payoff',
      body: isFr
        ? 'Ajoutez un montant “extra / mois” dans l’onglet Dettes pour réduire plus vite vos intérêts.'
        : 'Add an “extra per month” amount in Debts to reduce your interest faster.',
      cta: {
        label: isFr ? 'Ouvrir Dettes' : 'Open Debts',
        action: () => window.location.assign('?tab=debts')
      }
    });
  }

  // Épargne/Dettes — faible marge vs. cibles
  const savingsDebtRoom = Math.max(0, targets.savingsDebtPct - allocations.pctSavingsDebt);
  if (savingsDebtRoom > 5 && !isDismissed('tip-savings-room')) {
    tips.push({
      id: 'tip-savings-room',
      icon: <PiggyBank className="w-4 h-4 text-indigo-700" />,
      title: isFr ? 'Augmenter l’épargne/dettes' : 'Increase savings/debt allocation',
      body: isFr
        ? `Il reste un écart d’environ ${savingsDebtRoom.toFixed(1)} points par rapport à la cible Épargne/Dettes.`
        : `There is roughly a ${savingsDebtRoom.toFixed(1)} point gap to your Savings/Debt target.`,
      cta: {
        label: isFr ? 'Voir 50/30/20' : 'See 50/30/20',
        action: () => window.location.assign('?tab=budgetRule')
      }
    });
  }

  const onReadGuide = async () => {
    try {
      const { GamificationService } = await import('@/services/GamificationService');
      GamificationService.getInstance().logActivity('guide_read');
    } catch (e) {
      // Silencieux
    }
  };

  // Détection: dépenses en double (même libellé)
  if ((expenses || []).length > 0 && !isDismissed('tip-duplicate-expenses')) {
    const map = new Map<string, number>();
    for (const e of (expenses || [])) {
      if (!e.isActive) continue;
      const key = (e.description || e.subcategory || '').trim().toLowerCase();
      if (!key) continue;
      map.set(key, (map.get(key) || 0) + 1);
    }
    const dups = Array.from(map.entries()).filter(([, c]) => c >= 2);
    if (dups.length > 0) {
      tips.push({
        id: 'tip-duplicate-expenses',
        icon: <PiggyBank className="w-4 h-4 text-indigo-700" />,
        title: isFr ? 'Dépenses en double détectées' : 'Duplicate expenses detected',
        body: isFr
          ? 'Vous avez plusieurs postes avec le même libellé. Consolidation recommandée pour éviter les doublons et erreurs.'
          : 'You have multiple items with the same label. Consolidation is recommended to avoid duplicates and errors.',
        cta: {
          label: isFr ? 'Ouvrir Dépenses' : 'Open Expenses',
          action: () => window.location.assign('?tab=expenses')
        }
      });
    }
  }

  // Détection: pic de dépenses mensuelles (>20% vs. baseline)
  try {
    const baselineRaw = localStorage.getItem('budget-baseline-monthly-expenses');
    if (baselineRaw && !isDismissed('tip-monthly-spike')) {
      const baseObj = JSON.parse(baselineRaw);
      const baseVal = typeof baseObj?.value === 'number' ? baseObj.value : 0;
      if (baseVal > 0 && monthlyFromExpenses > baseVal * 1.2) {
        tips.push({
          id: 'tip-monthly-spike',
          icon: <Target className="w-4 h-4 text-amber-700" />,
          title: isFr ? 'Pic de dépenses ce mois-ci' : 'This month’s expenses spiked',
          body: isFr
            ? `Vos dépenses mensuelles dépassent de plus de 20 % la référence récente. Explorez vos postes récents pour identifier la cause.`
            : `Your monthly expenses exceed the recent baseline by over 20%. Review recent items to find the cause.`,
          cta: {
            label: isFr ? 'Analyser Dépenses' : 'Review Expenses',
            action: () => window.location.assign('?tab=expenses')
          }
        });
      }
    }
  } catch {
    // ignore
  }

  // Détection: charges annuelles non provisionnées (pas de sinking fund correspondant)
  if ((expenses || []).length > 0 && !isDismissed('tip-annual-unprovisioned')) {
    const normalize = (s: string) =>
      (s || '')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim();

    const fundsNorm = (sinkingFunds || []).map(f => normalize(f.name || '')).filter(Boolean);

    const annuals = (expenses || []).filter(
      e => e.isActive && (e.frequency === 'annually' || e.frequency === 'quarterly')
    );

    // Correspondance améliorée: normalisation + mapping simple par mots-clés/catégorie
    const keywordMap: Record<string, string[]> = {
      logement: ['taxe', 'taxes', 'municipal', 'municipales', 'habitation', 'assurance habitation'],
      transport: ['immatriculation', 'assurance auto', 'permis', 'licence'],
      services: ['hydro', 'electricite', 'electricite', 'gaz', 'eau', 'internet'],
      sante: ['assurance sante', 'dentaire', 'optometrist', 'optique'],
      divers: ['assurance vie', 'banque', 'frais bancaires']
    };

    const missingEntries: ExpenseEntry[] = [];
    for (const e of annuals) {
      const label = normalize(e.description || e.subcategory || e.category || '');
      const hasDirect = fundsNorm.some(fn => !!label && (fn.includes(label) || label.includes(fn)));
      if (hasDirect) continue;

      // Matching par mots-clés/catégorie
      let matched = false;
      const keys = keywordMap[e.category] || [];
      for (const kw of keys) {
        if (label.includes(kw)) {
          matched = fundsNorm.some(fn => fn.includes(kw));
          if (matched) break;
        }
      }
      if (!matched) missingEntries.push(e);
    }

    if (missingEntries.length > 0) {
      const makeDue = (monthsAhead: number) => {
        const d = new Date();
        d.setMonth(d.getMonth() + monthsAhead, 1);
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${y}-${m}-${day}`;
      };

      const buildPrefill = () => {
        const payload = {
          funds: missingEntries.slice(0, 3).map((e, idx) => {
            const baseName = e.description || e.subcategory || e.category || (isFr ? 'Nouvel objectif' : 'New goal');
            const name = baseName.length > 48 ? baseName.slice(0, 48) : baseName;
            const goal = Math.max(0, e.amount || 0); // montant par période (annuelle=année, trimestrielle=trimestre)
            const due = e.frequency === 'annually' ? makeDue(12) : makeDue(3);
            return {
              id: `sf-prefill-${Date.now()}-${idx}`,
              name,
              goalAmount: goal,
              dueDate: due,
              monthlyRequired: 0,
              saved: 0
            };
          })
        };
        localStorage.setItem('sinking-prefill', JSON.stringify(payload));
      };

      tips.push({
        id: 'tip-annual-unprovisioned',
        icon: <Shield className="w-4 h-4 text-indigo-700" />,
        title: isFr ? 'Charges annuelles non provisionnées' : 'Unprovisioned annual charges',
        body: isFr
          ? `Nous avons détecté ${missingEntries.length} dépense(s) annuelle(s)/trimestrielle(s) sans objectif planifié. Créez un “objectif planifié” pour étaler le coût.`
          : `Detected ${missingEntries.length} annual/quarterly expense(s) without a planned goal. Create a “planned goal” to spread the cost.`,
        cta: {
          label: isFr ? 'Créer objectif' : 'Create goal',
          action: () => {
            try {
              buildPrefill();
            } catch {
              // ignore
            }
            window.location.assign('?tab=sinking');
          }
        }
      });
    }
  }

  if (tips.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      {tips.map(t => (
        <Alert key={t.id} className="border-slate-300 bg-white text-slate-900">
          <AlertDescription className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div className="flex items-start gap-2">
              <span className="mt-0.5">{t.icon}</span>
              <div>
                <div className="font-semibold">{t.title}</div>
                <div className="text-sm text-slate-700">{t.body}</div>
                <button
                  onClick={onReadGuide}
                  className="mt-1 inline-flex items-center text-xs text-blue-700 hover:underline"
                  title={isFr ? 'Marquer comme lu (guide)' : 'Mark as read (guide)'}
                >
                  <BookOpen className="w-3 h-3 mr-1" />
                  {isFr ? 'Lire un guide associé' : 'Read a related guide'}
                </button>
              </div>
            </div>
            <div className="flex gap-2">
              {t.cta && (
                <Button onClick={t.cta.action} className="bg-blue-600 hover:bg-blue-700 text-white">
                  <LinkIcon className="w-4 h-4 mr-2" />
                  {t.cta.label}
                </Button>
              )}
              <Button variant="outline" onClick={() => dismiss30(t.id)}>
                {isFr ? 'Masquer 30 jours' : 'Hide 30 days'}
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      ))}
    </div>
  );
};

export default ContextualTipsPanel;
