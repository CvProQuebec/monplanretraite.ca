export type PlanTier = 'free' | 'professional' | 'expert';

export interface ToolItem {
  id: string;
  plan: PlanTier;
  routeFr: string;
  routeEn: string;
  titleFr: string;
  titleEn: string;
  descFr: string;
  descEn: string;
  icon?: string;
}

/**
 * Catalogue centralisé de 27 outils.
 * - Conformité OQLF: titres FR avec seule la première majuscule; terminologie française; pas d'anglicisme.
 * - Les routes pointent vers les pages existantes (voir App.tsx). Adapter si les routes évoluent.
 */
export const TOOLS_CATALOG: ToolItem[] = [
  // ====== GRATUIT (5) ======
  {
    id: 'financial-assistant',
    plan: 'free',
    routeFr: '/assistant-financier',
    routeEn: '/financial-assistant',
    titleFr: 'Assistant financier',
    titleEn: 'Financial assistant',
    descFr: 'Recevez des conseils généraux et des étapes guidées pour organiser vos premières actions.',
    descEn: 'Get general guidance and step-by-step help to organize your first actions.',
    icon: 'help-circle'
  },
  {
    id: 'emergency-planning',
    plan: 'free',
    routeFr: '/planification-urgence',
    routeEn: '/emergency-planning',
    titleFr: 'Planification d’urgence',
    titleEn: 'Emergency planning',
    descFr: 'Rassemblez les informations essentielles et préparez des documents prêts à imprimer.',
    descEn: 'Gather key information and prepare print-ready documents.',
    icon: 'shield'
  },
  {
    id: 'expense-planning',
    plan: 'free',
    routeFr: '/planification-depenses',
    routeEn: '/expense-planning',
    titleFr: 'Planification de dépenses',
    titleEn: 'Expense planning',
    descFr: 'Planifiez vos dépenses mensuelles et repérez les économies rapides.',
    descEn: 'Plan your monthly expenses and spot quick savings.',
    icon: 'wallet'
  },
  {
    id: 'rrq-quick-compare',
    plan: 'free',
    routeFr: '/rrq-quick-compare',
    routeEn: '/rrq-quick-compare',
    titleFr: 'Comparateur RRQ/CPP',
    titleEn: 'RRQ/CPP quick compare',
    descFr: 'Comparez rapidement vos options RRQ/CPP pour visualiser les écarts.',
    descEn: 'Quickly compare RRQ/CPP options to visualize differences.',
    icon: 'scales'
  },
  {
    id: 'rrq-delay-simulator',
    plan: 'free',
    routeFr: '/rrq-delay-simulator',
    routeEn: '/rrq-delay-simulator',
    titleFr: 'Report RRQ/CPP de x mois',
    titleEn: 'RRQ/CPP defer by x months',
    descFr: 'Simulez l’impact d’un report mensuel de vos prestations.',
    descEn: 'Simulate the impact of deferring your benefits by months.',
    icon: 'clock'
  },

  // ====== PROFESSIONNEL (21) ======
  {
    id: 'advanced-performance-calculator',
    plan: 'professional',
    routeFr: '/calculette-rendement-avancee',
    routeEn: '/advanced-performance-calculator',
    titleFr: 'Calculette de rendement avancée',
    titleEn: 'Advanced performance calculator',
    descFr: 'Évaluez vos rendements et comparez des scénarios simples.',
    descEn: 'Evaluate returns and compare simple scenarios.',
    icon: 'line-chart'
  },
  {
    id: 'four-percent-rule',
    plan: 'professional',
    routeFr: '/regle-4-pourcent',
    routeEn: '/four-percent-rule',
    titleFr: 'Règle du 4 %',
    titleEn: '4% rule',
    descFr: 'Estimez un retrait durable selon la règle du 4 %.',
    descEn: 'Estimate a sustainable withdrawal using the 4% rule.',
    icon: 'percent'
  },
  {
    id: 'optimal-allocation',
    plan: 'professional',
    routeFr: '/module-allocation-optimale',
    routeEn: '/module-allocation-optimale',
    titleFr: 'Allocation optimale',
    titleEn: 'Optimal allocation',
    descFr: 'Trouvez une répartition adaptée à votre tolérance au risque.',
    descEn: 'Find an allocation that matches your risk tolerance.',
    icon: 'pie-chart'
  },
  {
    id: 'celiapp',
    plan: 'professional',
    routeFr: '/celiapp',
    routeEn: '/celiapp',
    titleFr: 'CELIAPP',
    titleEn: 'FHSA',
    descFr: 'Planifiez vos cotisations et retraits CELIAPP efficacement.',
    descEn: 'Plan FHSA contributions and withdrawals effectively.',
    icon: 'banknote'
  },
  {
    id: 'asset-consolidation',
    plan: 'professional',
    routeFr: '/module-consolidation-actifs',
    routeEn: '/module-consolidation-actifs',
    titleFr: 'Consolidation d’actifs',
    titleEn: 'Asset consolidation',
    descFr: 'Regroupez vos comptes et simplifiez votre suivi.',
    descEn: 'Consolidate accounts and simplify tracking.',
    icon: 'merge'
  },
  {
    id: 'financial-consolidation',
    plan: 'professional',
    routeFr: '/consolidation-financiere',
    routeEn: '/financial-consolidation',
    titleFr: 'Consolidation financière',
    titleEn: 'Financial consolidation',
    descFr: 'Réduisez la complexité et les frais liés aux multiples institutions.',
    descEn: 'Reduce complexity and fees across multiple institutions.',
    icon: 'layers'
  },
  {
    id: 'healthcare-costs',
    plan: 'professional',
    routeFr: '/couts-sante',
    routeEn: '/healthcare-costs',
    titleFr: 'Coûts de santé',
    titleEn: 'Healthcare costs',
    descFr: 'Projetez des dépenses de santé réalistes dans votre budget.',
    descEn: 'Project realistic healthcare expenses in your budget.',
    icon: 'heart-pulse'
  },
  {
    id: 'excess-liquidity-detector',
    plan: 'professional',
    routeFr: '/detecteur-liquidites-excessives',
    routeEn: '/detecteur-liquidites-excessives',
    titleFr: 'Détecteur liquidités excessives',
    titleEn: 'Excess liquidity detector',
    descFr: 'Identifiez les montants dormants et réallouez intelligemment.',
    descEn: 'Identify idle amounts and reallocate smartly.',
    icon: 'droplet'
  },
  {
    id: 'tax-impact-65',
    plan: 'professional',
    routeFr: '/calculateur-impact-fiscal-65',
    routeEn: '/calculateur-impact-fiscal-65',
    titleFr: 'Impact fiscal à 65 ans',
    titleEn: 'Tax impact at 65',
    descFr: 'Simulez les crédits et avantages automatiques à 65 ans.',
    descEn: 'Simulate automatic credits and benefits at age 65.',
    icon: 'calendar'
  },
  {
    id: 'ferr-optimization',
    plan: 'professional',
    routeFr: '/optimisation-ferr',
    routeEn: '/ferr-optimization',
    titleFr: 'Optimisation FERR',
    titleEn: 'RRIF optimization',
    descFr: 'Optimisez vos retraits FERR et limitez l’impôt à long terme.',
    descEn: 'Optimize RRIF withdrawals and limit long-term tax.',
    icon: 'sliders'
  },
  {
    id: 'multi-source-tax-optimization',
    plan: 'professional',
    routeFr: '/optimisation-fiscale-multi-sources',
    routeEn: '/multi-source-tax-optimization',
    titleFr: 'Optimisation fiscale multi-sources',
    titleEn: 'Multi-source tax optimization',
    descFr: 'Coordonnez retraits et revenus pour réduire l’impôt total.',
    descEn: 'Coordinate withdrawals and income to reduce total tax.',
    icon: 'calculator'
  },
  {
    id: 'cpp-timing',
    plan: 'professional',
    routeFr: '/optimisation-timing-cpp',
    routeEn: '/cpp-timing',
    titleFr: 'Optimisation timing CPP',
    titleEn: 'CPP timing optimization',
    descFr: 'Déterminez le meilleur moment pour déclencher le CPP.',
    descEn: 'Determine the best time to start CPP.',
    icon: 'timer'
  },
  {
    id: 'longevity-planning',
    plan: 'professional',
    routeFr: '/planification-longevite',
    routeEn: '/longevity-planning',
    titleFr: 'Planification longévité',
    titleEn: 'Longevity planning',
    descFr: 'Testez vos besoins selon diverses hypothèses de longévité.',
    descEn: 'Test needs under different longevity assumptions.',
    icon: 'dna'
  },
  {
    id: 'dynamic-withdrawal',
    plan: 'expert',
    routeFr: '/planification-retrait-dynamique',
    routeEn: '/dynamic-withdrawal',
    titleFr: 'Planification des retraits dynamiques',
    titleEn: 'Dynamic withdrawal planning',
    descFr: 'Adaptez vos retraits aux marchés et à vos objectifs.',
    descEn: 'Adapt withdrawals to markets and your objectives.',
    icon: 'activity'
  },
  {
    id: 'inflation-protection',
    plan: 'expert',
    routeFr: '/centre-protection-inflation',
    routeEn: '/centre-protection-inflation',
    titleFr: 'Protection contre l\'inflation',
    titleEn: 'Inflation protection',
    descFr: 'Renforcez votre plan contre la hausse des prix.',
    descEn: 'Strengthen your plan against rising prices.',
    icon: 'shield-half'
  },
  {
    id: 'ferr-optimization',
    plan: 'expert',
    routeFr: '/optimisation-ferr',
    routeEn: '/ferr-optimization',
    titleFr: 'Optimisation du FERR',
    titleEn: 'RRIF optimization',
    descFr: 'Optimisez vos retraits FERR et limitez l’impôt à long terme.',
    descEn: 'Optimize RRIF withdrawals and limit long-term tax.',
    icon: 'sliders'
  },
  {
    id: 'multi-source-tax-optimization',
    plan: 'expert',
    routeFr: '/optimisation-fiscale-multi-sources',
    routeEn: '/multi-source-tax-optimization',
    titleFr: 'Optimisation fiscale multi-sources',
    titleEn: 'Multi-source tax optimization',
    descFr: 'Coordonnez retraits et revenus pour réduire l’impôt total.',
    descEn: 'Coordinate withdrawals and income to reduce total tax.',
    icon: 'calculator'
  },
  {
    id: 'rvdaa',
    plan: 'expert',
    routeFr: '/rvdaa',
    routeEn: '/rvdaa',
    titleFr: 'RVDAA',
    titleEn: 'RVDAA',
    descFr: 'Outil spécialisé pour scénarios d’épargne et décaissement.',
    descEn: 'Specialized tool for saving and decumulation scenarios.',
    icon: 'ruler'
  },
  {
    id: 'withdrawal-sequence',
    plan: 'professional',
    routeFr: '/sequence-retrait',
    routeEn: '/withdrawal-sequence',
    titleFr: 'Séquence de retrait',
    titleEn: 'Withdrawal sequence',
    descFr: 'Appliquez un ordre de retraits cohérent et mesurable.',
    descEn: 'Apply a consistent, measurable withdrawal order.',
    icon: 'list-ordered'
  },
  {
    id: 'rrsp-meltdown',
    plan: 'expert',
    routeFr: '/strategies-reer-meltdown',
    routeEn: '/rrsp-meltdown',
    titleFr: 'Stratégies de fonte du REER',
    titleEn: 'RRSP meltdown strategies',
    descFr: 'Réduisez vos REER de façon contrôlée pour limiter l’impôt futur.',
    descEn: 'Wind down RRSPs in a controlled way to limit future tax.',
    icon: 'thermometer'
  },
  {
    id: 'cash-wedge-bucket',
    plan: 'professional',
    routeFr: '/module-coussin-liquidites',
    routeEn: '/module-coussin-liquidites',
    titleFr: 'Stratégie coussin liquidités',
    titleEn: 'Cash wedge strategy',
    descFr: 'Constituez un coussin pour éviter de vendre en période de baisse.',
    descEn: 'Build a cushion to avoid selling during downturns.',
    icon: 'cup-soda'
  },

  // ====== EXPERT (1) ======
  {
    id: 'succession-planning',
    plan: 'expert',
    routeFr: '/planification-successorale',
    routeEn: '/succession-planning',
    titleFr: 'Planification successorale',
    titleEn: 'Succession planning',
    descFr: 'Préparez le transfert de patrimoine avec des documents clairs.',
    descEn: 'Prepare estate transfer with clear documentation.',
    icon: 'scroll-text'
  }
];
