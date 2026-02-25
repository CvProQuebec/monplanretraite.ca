import React, { useMemo, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/features/retirement/hooks/useLanguage';
import { ArrowRight, CheckCircle, Crown, Shield, Sparkles, Users } from 'lucide-react';
import { FEATURE_CATALOG, Tier } from '@/config/plans';

type PlanFeature = {
  key: string;
  icon?: 'check' | 'sparkles' | 'users';
  textFr: string;
  textEn: string;
  children?: Array<{ key: string; textFr: string; textEn: string }>;
};

type PlanConfig = {
  id: 'free' | 'professional' | 'expert';
  icon: React.ComponentType<{ className?: string }>;
  nameFr: string;
  nameEn: string;
  priceFr: string;
  priceEn: string;
  priceNoteFr?: string;
  priceNoteEn?: string;
  badge?: { textFr: string; textEn: string; bgClass: string };
  colors: { icon: string; title: string; price: string; note: string; feature: string };
  value: {
    titleFr: string;
    titleEn: string;
    subtitleFr: string;
    subtitleEn: string;
    bgClass: string;
    textClass: string;
  };
  features: PlanFeature[];
  cta: {
    kind: 'startFree' | 'professional' | 'expert';
    labelFr: string;
    labelEn: string;
    buttonClass: string;
  };
};

const iconMap: Record<NonNullable<PlanFeature['icon']>, React.ComponentType<{ className?: string }>> = {
  check: CheckCircle,
  sparkles: Sparkles,
  users: Users,
};

const plans: PlanConfig[] = [
  {
    id: 'free',
    icon: Shield,
    nameFr: 'Gratuit',
    nameEn: 'Free',
    priceFr: '0 $',
    priceEn: '$0',
    colors: {
      icon: 'text-emerald-600',
      title: 'text-emerald-900',
      price: 'text-emerald-600',
      note: 'text-emerald-600',
      feature: 'text-emerald-500',
    },
    value: {
      titleFr: 'VALEUR : 500 $ GRATUIT',
      titleEn: 'VALUE: $500 FREE',
      subtitleFr: 'Seule plateforme au Qu\u00E9bec \u00E0 offrir cela gratuitement',
      subtitleEn: 'Only platform in Quebec offering this for free',
      bgClass: 'bg-emerald-50',
      textClass: 'text-emerald-800',
    },
    features: [
      { key: 'free-emergency', textFr: "Module d'urgence professionnel (8 sections)", textEn: 'Professional emergency module (8 sections)' },
      { key: 'free-budget', textFr: 'Planification budget/d\u00E9penses (lite)', textEn: 'Budget/expenses planning (lite)' },
      { key: 'free-calculators-return', textFr: 'Calculatrice de rendement simple', textEn: 'Simple return calculator' },
      { key: 'free-calculators-options', textFr: "Comparateur d'options d'achat", textEn: 'Purchase options comparator' },
      { key: 'free-calculators-budget', textFr: 'Estimateur de budget mensuel (lite)', textEn: 'Monthly budget estimator (lite)' },
      { key: 'free-calculators-preview', textFr: 'Aperçu RRQ/CPP — montants et impact', textEn: 'RRQ/CPP preview — amounts and impact' },
      { key: 'free-calculators-tips', textFr: 'Conseils essentiels (aperçu)', textEn: 'Essential tips (preview)' },
      { key: 'free-income', textFr: 'Gestion revenus et prestations RRQ/CPP', textEn: 'Income and RRQ/CPP benefits' },
      { key: 'free-security', textFr: 'S\u00E9curit\u00E9 bancaire (AES-256)', textEn: 'Bank-grade security (AES-256)' },
      { key: 'free-simulations', textFr: '5 simulations/mois \u2014 Donn\u00E9es 100 % priv\u00E9es', textEn: '5 simulations/month \u2014 100% private data' },
    ],
    cta: {
      kind: 'startFree',
      labelFr: 'Commencer GRATUITEMENT',
      labelEn: 'Start FREE',
      buttonClass: 'bg-emerald-600 hover:bg-emerald-700 text-white',
    },
  },
  {
    id: 'professional',
    icon: Sparkles,
    nameFr: 'Professionnel',
    nameEn: 'Professional',
    priceFr: '297 $',
    priceEn: '$297',
    priceNoteFr: '/an',
    priceNoteEn: '/year',
    badge: { textFr: 'RECOMMAND\u00C9', textEn: 'RECOMMENDED', bgClass: 'bg-mpr-interactive text-white' },
    colors: {
      icon: 'text-mpr-interactive',
      title: 'text-mpr-navy',
      price: 'text-mpr-interactive',
      note: 'text-mpr-interactive',
      feature: 'text-mpr-interactive',
    },
    value: {
      titleFr: 'VALEUR : 5 000 $ pour 297 $',
      titleEn: 'VALUE: $5,000 for $297',
      subtitleFr: '\u00C9conomie de 94 %',
      subtitleEn: '94% savings',
      bgClass: 'bg-mpr-interactive-lt',
      textClass: 'text-mpr-navy',
    },
    features: [
      { key: 'pro-everything-plus', textFr: 'Tout du plan Gratuit + fonctionnalit\u00E9s avanc\u00E9es (born\u00E9es)', textEn: 'Everything from Free + advanced features (limited)' },
      { key: 'pro-ai', icon: 'sparkles', textFr: 'Assistant IA Personnel (pr\u00E9vention catastrophes)', textEn: 'Personal AI assistant (prevents disasters)' },
      { key: 'pro-calculators', textFr: 'Calculateurs avanc\u00E9s (IRR, TWR, Monte Carlo aper\u00E7u)', textEn: 'Advanced calculators (IRR, TWR, Monte Carlo preview)' },
      { key: 'pro-modules', textFr: 'Modules RREGOP + SRG complets', textEn: 'RREGOP + GIS modules (complete)' },
      { key: 'pro-tax', textFr: 'Optimisation fiscale (de base)', textEn: 'Tax optimization (basic)' },
      { key: 'pro-pdf', textFr: 'PDF r\u00E9sum\u00E9 (filigrane) \u2014 50 simulations/mois', textEn: 'Summary PDFs (watermark) \u2014 50 simulations/mo' },
    ],
    cta: {
      kind: 'professional',
      labelFr: 'Choisir Professionnel',
      labelEn: 'Choose Professional',
      buttonClass: 'bg-mpr-interactive hover:bg-mpr-interactive-dk text-white',
    },
  },
  {
    id: 'expert',
    icon: Crown,
    nameFr: 'Expert',
    nameEn: 'Expert',
    priceFr: '597 $',
    priceEn: '$597',
    priceNoteFr: '/an',
    priceNoteEn: '/year',
    colors: {
      icon: 'text-purple-600',
      title: 'text-purple-900',
      price: 'text-purple-600',
      note: 'text-purple-600',
      feature: 'text-purple-500',
    },
    value: {
      titleFr: 'VALEUR : 10 000 $ pour 597 $',
      titleEn: 'VALUE: $10,000 for $597',
      subtitleFr: 'Niveau consultant \u2014 \u00C9conomie de 94 % \u2014 \u00C9vite erreurs co\u00FBteuses',
      subtitleEn: 'Consultant level \u2014 94% savings \u2014 Avoids costly mistakes',
      bgClass: 'bg-purple-50',
      textClass: 'text-purple-900',
    },
    features: [
      { key: 'expert-suite', textFr: 'Suite compl\u00E8te : 75+ fonctionnalit\u00E9s', textEn: 'Complete suite: 75+ features' },
      { key: 'expert-estate', icon: 'users', textFr: 'Planification successorale compl\u00E8te', textEn: 'Complete estate planning' },
      { key: 'expert-montecarlo', textFr: 'Monte Carlo 2000 it\u00E9rations \u2014 IA pr\u00E9dictive', textEn: 'Monte Carlo 2000 iterations \u2014 Predictive AI' },
      { key: 'expert-realestate', textFr: 'Optimisation immobili\u00E8re avanc\u00E9e', textEn: 'Advanced real-estate optimization' },
      { key: 'expert-reports', textFr: 'Rapports niveau consultant \u2014 Export PDF + CSV', textEn: 'Consultant-level reports \u2014 PDF + CSV' },
    ],
    cta: {
      kind: 'expert',
      labelFr: 'Choisir Expert',
      labelEn: 'Choose Expert',
      buttonClass: 'bg-purple-600 hover:bg-purple-700 text-white',
    },
  },
];

type PlansSectionProps = {
  onStartFree: () => void;
  onSelectPlan: (plan: 'professional' | 'expert') => void;
};

const PlansSection: React.FC<PlansSectionProps> = ({ onStartFree, onSelectPlan }) => {
  const { language } = useLanguage();
  const isFrench = language === 'fr';
  const [showComparison, setShowComparison] = useState(false);
  const comparisonRef = useRef<HTMLDivElement | null>(null);

  const featureCatalog = FEATURE_CATALOG;
  const labelOf = (f: { labelFr: string; labelEn: string }) => (isFrench ? f.labelFr : f.labelEn);
  const sortByLabel = (a: typeof featureCatalog[number], b: typeof featureCatalog[number]) =>
    labelOf(a).localeCompare(labelOf(b), isFrench ? 'fr-CA' : 'en-CA');
  const freePriority = new Map<string, number>([['emergency', 0]]);
  const sortFree = (a: typeof featureCatalog[number], b: typeof featureCatalog[number]) => {
    const pa = freePriority.get(a.key) ?? 999;
    const pb = freePriority.get(b.key) ?? 999;
    return pa !== pb ? pa - pb : labelOf(a).localeCompare(labelOf(b), isFrench ? 'fr-CA' : 'en-CA');
  };

  const freeList = useMemo(() => featureCatalog.filter((f) => f.tier === 'free').sort(sortFree), [featureCatalog]);
  const proOnlyList = useMemo(() => featureCatalog.filter((f) => f.tier === 'pro').sort(sortByLabel), [featureCatalog]);
  const expertOnlyList = useMemo(() => featureCatalog.filter((f) => f.tier === 'expert').sort(sortByLabel), [featureCatalog]);

  const included = (tier: Tier, plan: Tier) => ({ free: 0, pro: 1, expert: 2 }[plan] >= { free: 0, pro: 1, expert: 2 }[tier]);
  const planLabels: Record<Tier, string> = {
    free: isFrench ? 'Forfait Gratuit' : 'Free plan',
    pro: isFrench ? 'Forfait Professionnel' : 'Professional plan',
    expert: isFrench ? 'Forfait Expert' : 'Expert plan',
  };

  const includedLabel = isFrench ? 'Inclus' : 'Included';
  const notIncludedLabel = isFrench ? 'Non inclus' : 'Not included';

  const renderComparisonCell = (featureTier: Tier, plan: Tier) => {
    const isIncluded = included(featureTier, plan);

    return (
      <span
        className={`inline-flex items-center justify-center ${isIncluded ? 'text-emerald-500' : 'text-gray-400'}`}
      >
        {isIncluded ? (
          <CheckCircle className="h-5 w-5" aria-hidden="true" />
        ) : (
          <span aria-hidden="true">{'\u2014'}</span>
        )}
        <span className="sr-only">
          {`${isIncluded ? includedLabel : notIncludedLabel} - ${planLabels[plan]}`}
        </span>
      </span>
    );
  };


  const handlePlanClick = (kind: PlanConfig['cta']['kind']) => {
    if (kind === 'startFree') {
      onStartFree();
    } else {
      onSelectPlan(kind);
    }
  };

  const toggleComparison = () => {
    setShowComparison((prev) => {
      const next = !prev;
      if (!prev) {
        setTimeout(() => comparisonRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);
      }
      return next;
    });
  };

  return (
    <div className="bg-gradient-to-br from-mpr-navy via-mpr-navy-mid to-mpr-interactive py-16 rounded-2xl mb-10">
      <div className="text-center mb-4 px-4">
        <h2 className="text-4xl font-bold text-white mb-3">
          {isFrench ? 'Allez plus loin avec la planification financière complète' : 'Go further with complete financial planning'}
        </h2>
        <p className="text-xl text-white/80">
          {isFrench
            ? 'De la protection de base à la planification complète avec IA'
            : 'From basic protection to complete AI-powered planning'}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 px-4 lg:grid-cols-3">
        {plans.map((plan) => {
          const headerPadding = plan.badge ? 'pt-10' : 'pt-6';
          const FeatureIconDefault = iconMap.check;
          return (
            <Card key={plan.id} className="bg-white shadow-2xl relative">
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className={`px-6 py-2 rounded-full text-sm font-bold ${plan.badge.bgClass}`}>
                    {isFrench ? plan.badge.textFr : plan.badge.textEn}
                  </div>
                </div>
              )}
              <CardHeader className={`text-center ${headerPadding}`}>
                <plan.icon className={`w-10 h-10 mx-auto mb-3 ${plan.colors.icon}`} />
                <CardTitle className={`text-2xl font-bold ${plan.colors.title}`}>
                  {isFrench ? plan.nameFr : plan.nameEn}
                </CardTitle>
                <div className={`text-4xl font-bold ${plan.colors.price}`}>
                  {isFrench ? plan.priceFr : plan.priceEn}
                  {(plan.priceNoteFr || plan.priceNoteEn) && (
                    <span className={`text-sm ${plan.colors.note} ml-1`}>
                      {isFrench ? plan.priceNoteFr : plan.priceNoteEn}
                    </span>
                  )}
                </div>
              </CardHeader>
              <CardContent className="px-6 pb-8">
                <div className={`${plan.value.bgClass} p-3 rounded-lg mb-4 text-sm ${plan.value.textClass}`}>
                  <div className="font-bold">{isFrench ? plan.value.titleFr : plan.value.titleEn}</div>
                  <div>{isFrench ? plan.value.subtitleFr : plan.value.subtitleEn}</div>
                </div>
                <div className="space-y-2 text-sm text-gray-800">
                  {plan.features.map((feature) => {
                    const FeatureIcon = feature.icon ? iconMap[feature.icon] : FeatureIconDefault;
                    return (
                      <div key={feature.key}>
                        <div className="flex items-center gap-2">
                          <FeatureIcon className={`w-4 h-4 ${plan.colors.feature}`} />
                          <span>{isFrench ? feature.textFr : feature.textEn}</span>
                        </div>
                        {feature.children && (
                          <ul className="list-disc list-inside pl-6 text-xs text-gray-600 space-y-1 mt-1">
                            {feature.children.map((child) => (
                              <li key={child.key}>{isFrench ? child.textFr : child.textEn}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    );
                  })}
                </div>
                <Button
                  onClick={() => handlePlanClick(plan.cta.kind)}
                  className={`w-full mt-5 font-bold py-3 ${plan.cta.buttonClass}`}
                >
                  {isFrench ? plan.cta.labelFr : plan.cta.labelEn}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="flex justify-center mt-8 px-4">
        <Button onClick={toggleComparison} className="bg-white text-mpr-navy hover:bg-mpr-interactive-lt font-bold px-8 py-3 rounded-xl shadow-md">
          {isFrench ? (showComparison ? 'Masquer la comparaison' : 'Comparer les plans') : (showComparison ? 'Hide comparison' : 'Compare plans')}
        </Button>
      </div>

      {showComparison && (
        <Card ref={comparisonRef} id="plans-compare" className="bg-white border-2 border-gray-200 shadow-xl mt-10 mx-4">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-3xl font-bold text-gray-900">
              {isFrench ? 'Comparaison d\u00E9taill\u00E9e des fonctionnalit\u00E9s' : 'Detailed plan comparison'}
            </CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th scope="col" className="text-left p-3 text-gray-700 border-b border-gray-200 w-2/3">{isFrench ? 'Fonctionnalit\u00E9' : 'Feature'}</th>
                  <th scope="col" className="text-center p-3 text-gray-700 border-b border-gray-200">{isFrench ? 'Gratuit' : 'Free'}</th>
                  <th scope="col" className="text-center p-3 text-gray-700 border-b border-gray-200">{isFrench ? 'Professionnel' : 'Pro'}</th>
                  <th scope="col" className="text-center p-3 text-gray-700 border-b border-gray-200">Expert</th>
                </tr>
              </thead>
              <tbody>
                {freeList.map((feature) => (
                  <tr key={`compare-free-${feature.key}`} className="hover:bg-gray-50">
                    <td className="p-3 border-b border-gray-100 text-gray-900"><div className="font-medium">{labelOf(feature)}</div></td>
                    <td className="p-3 border-b border-gray-100 text-center">{renderComparisonCell(feature.tier, 'free')}</td>
                    <td className="p-3 border-b border-gray-100 text-center">{renderComparisonCell(feature.tier, 'pro')}</td>
                    <td className="p-3 border-b border-gray-100 text-center">{renderComparisonCell(feature.tier, 'expert')}</td>
                  </tr>
                ))}
                {proOnlyList.map((feature) => (
                  <tr key={`compare-pro-${feature.key}`} className="hover:bg-gray-50">
                    <td className="p-3 border-b border-gray-100 text-gray-900"><div className="font-medium">{labelOf(feature)}</div></td>
                    <td className="p-3 border-b border-gray-100 text-center">{renderComparisonCell(feature.tier, 'free')}</td>
                    <td className="p-3 border-b border-gray-100 text-center">{renderComparisonCell(feature.tier, 'pro')}</td>
                    <td className="p-3 border-b border-gray-100 text-center">{renderComparisonCell(feature.tier, 'expert')}</td>
                  </tr>
                ))}
                {expertOnlyList.map((feature) => (
                  <tr key={`compare-expert-${feature.key}`} className="hover:bg-gray-50">
                    <td className="p-3 border-b border-gray-100 text-gray-900"><div className="font-medium">{labelOf(feature)}</div></td>
                    <td className="p-3 border-b border-gray-100 text-center">{renderComparisonCell(feature.tier, 'free')}</td>
                    <td className="p-3 border-b border-gray-100 text-center">{renderComparisonCell(feature.tier, 'pro')}</td>
                    <td className="p-3 border-b border-gray-100 text-center">{renderComparisonCell(feature.tier, 'expert')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="text-center mt-6">
              <Button onClick={() => setShowComparison(false)} className="bg-gray-100 text-gray-700 hover:bg-gray-200 font-semibold px-6 py-2 rounded-lg">
                {isFrench ? 'Fermer la comparaison' : 'Close comparison'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PlansSection;
