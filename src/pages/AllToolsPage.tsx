import React, { useEffect, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { TOOLS_CATALOG } from '@/config/tools-catalog';
import ToolCard from '@/components/ui/ToolCard';
import Meta from '@/components/ui/Meta';
import {
  ArrowRight,
  Calculator,
  Compass,
  FolderOpen,
  Landmark,
  PiggyBank,
} from 'lucide-react';

type ToolSection = {
  id: string;
  titleFr: string;
  titleEn: string;
  textFr: string;
  textEn: string;
  toolIds: string[];
};

const sections: ToolSection[] = [
  {
    id: 'evaluation',
    titleFr: 'Évaluer ma situation',
    titleEn: 'Assess my situation',
    textFr:
      'Commencez ici si vous voulez savoir où vous en êtes et quels points méritent votre attention.',
    textEn:
      'Start here if you want to understand where you stand and what deserves your attention.',
    toolIds: ['financial-assistant', 'expense-planning', 'advanced-performance-calculator', 'four-percent-rule'],
  },
  {
    id: 'revenus',
    titleFr: 'Préparer mes revenus de retraite',
    titleEn: 'Prepare my retirement income',
    textFr:
      'Utilisez ces outils pour vos rentes, vos retraits et la durée de votre argent.',
    textEn: 'Use these tools for pensions, withdrawals and how long your money may last.',
    toolIds: ['rrq-quick-compare', 'rrq-delay-simulator', 'ferr-optimization', 'withdrawal-sequence', 'longevity-planning'],
  },
  {
    id: 'impots',
    titleFr: 'Réduire mes impôts',
    titleEn: 'Reduce my taxes',
    textFr:
      'Comparez différents retraits et différentes sources de revenu pour payer moins d’impôt.',
    textEn: 'Compare withdrawals and income sources to reduce your tax burden.',
    toolIds: ['multi-source-tax-optimization', 'tax-impact-65', 'rrsp-meltdown', 'cash-wedge-bucket'],
  },
  {
    id: 'situations',
    titleFr: 'Situations particulières',
    titleEn: 'Special situations',
    textFr:
      'Pour les besoins plus précis, comme le CELIAPP, la santé, la consolidation ou la succession.',
    textEn:
      'For more specific needs such as FHSA, health costs, consolidation or succession.',
    toolIds: ['celiapp', 'healthcare-costs', 'financial-consolidation', 'asset-consolidation', 'emergency-kit', 'succession-planning'],
  },
];

const quickActions = [
  {
    icon: Compass,
    titleFr: 'Par où commencer',
    titleEn: 'Where to start',
    textFr: 'Suivez un parcours guidé simple.',
    textEn: 'Follow a simple guided path.',
    hrefFr: '/commencer',
    hrefEn: '/start-here',
  },
  {
    icon: FolderOpen,
    titleFr: 'Préparer mon dossier',
    titleEn: 'Prepare my dossier',
    textFr: 'Rassemblez les éléments à montrer à votre planificateur.',
    textEn: 'Gather the items to show your planner.',
    hrefFr: '/mon-dossier',
    hrefEn: '/my-dossier',
  },
  {
    icon: Landmark,
    titleFr: 'Voir mes rapports',
    titleEn: 'See my reports',
    textFr: 'Consultez vos résumés et vos rapports retraite.',
    textEn: 'Review your retirement summaries and reports.',
    hrefFr: '/fr/rapports-retraite',
    hrefEn: '/en/retirement-reports',
  },
];

const situations = [
  {
    titleFr: 'Je suis à 5 ans de la retraite',
    titleEn: 'I am within 5 years of retirement',
    textFr: 'Commencez par votre dossier, votre budget et vos revenus de retraite.',
    textEn: 'Start with your dossier, budget and retirement income.',
    hrefFr: '/mon-dossier',
    hrefEn: '/my-dossier',
  },
  {
    titleFr: 'Je veux savoir quand demander mes rentes',
    titleEn: 'I want to know when to start my pensions',
    textFr: 'Allez directement aux outils RRQ, retraits et FERR.',
    textEn: 'Go straight to QPP, withdrawal and RRIF tools.',
    hrefFr: '/outils#revenus',
    hrefEn: '/tools#revenus',
  },
  {
    titleFr: 'Je veux payer moins d’impôt',
    titleEn: 'I want to pay less tax',
    textFr: 'Consultez d’abord les outils fiscaux et les retraits coordonnés.',
    textEn: 'Start with tax tools and coordinated withdrawal strategies.',
    hrefFr: '/outils#impots',
    hrefEn: '/tools#impots',
  },
  {
    titleFr: 'Je suis travailleur autonome ou incorporé',
    titleEn: 'I am self-employed or incorporated',
    textFr: 'Passez par les outils spécialisés et préparez votre dossier.',
    textEn: 'Use the specialized tools and prepare your dossier.',
    hrefFr: '/outils#situations',
    hrefEn: '/tools#situations',
  },
];

export default function AllToolsPage() {
  const location = useLocation();
  const isEnglish = location.pathname.startsWith('/en') || location.pathname === '/tools';

  const uniqueTools = useMemo(
    () => Array.from(new Map(TOOLS_CATALOG.map((tool) => [tool.id, tool])).values()),
    []
  );

  const toolsById = useMemo(
    () => new Map(uniqueTools.map((tool) => [tool.id, tool])),
    [uniqueTools]
  );

  useEffect(() => {
    if (!location.hash) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const target = document.getElementById(location.hash.replace('#', ''));
    if (target) {
      setTimeout(() => target.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
    }
  }, [location.hash]);

  return (
    <div
      className="min-h-screen"
      style={{ background: 'linear-gradient(180deg, #f8fafc 0%, #ffffff 30%, #f8fafc 100%)' }}
    >
      <Meta
        title={
          isEnglish
            ? 'Retirement calculators and tools | MonPlanRetraite.ca'
            : 'Calculateurs et outils de retraite | MonPlanRetraite.ca'
        }
        description={
          isEnglish
            ? 'Find retirement planning tools by need: income, taxes, withdrawals, special situations and planner dossier preparation.'
            : 'Trouvez les bons outils de retraite selon votre besoin: revenus, impôt, retraits, situations particulières et préparation du dossier.'
        }
        lang={isEnglish ? 'en' : 'fr'}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 md:py-14">
        <section
          className="rounded-3xl p-6 md:p-10"
          style={{
            background:
              'radial-gradient(circle at top left, rgba(76,110,245,0.12), transparent 36%), linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
            border: '1px solid var(--mpr-border)',
            boxShadow: '0 10px 15px -3px rgba(0,0,0,0.08), 0 4px 6px -2px rgba(0,0,0,0.05)',
          }}
        >
          <div className="max-w-3xl">
            <div
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-base font-semibold"
              style={{ background: '#e3f2fd', color: 'var(--mpr-h2)' }}
            >
              <Calculator className="h-5 w-5" />
              <span>{isEnglish ? 'Retirement tools by need' : 'Outils retraite par besoin'}</span>
            </div>
            <h1 className="mt-5 mb-4">
              {isEnglish
                ? 'Find the right retirement calculator without getting lost'
                : 'Trouvez le bon calculateur retraite sans vous perdre'}
            </h1>
            <p className="text-[18px] leading-8 text-[color:var(--mpr-text)]">
              {isEnglish
                ? 'We grouped the tools by real questions: where to start, retirement income, taxes, withdrawals and special situations.'
                : 'Nous avons regroupé les outils selon de vraies questions: par où commencer, revenus de retraite, impôts, retraits et situations particulières.'}
            </p>
            <p className="mt-4 text-[16px] leading-7 text-[color:var(--mpr-text-muted)]">
              {isEnglish
                ? 'Each section points you to the next useful step, so you can move from question to action.'
                : 'Chaque section vous montre aussi la prochaine étape utile, pour passer de votre question à une action concrète.'}
            </p>
          </div>
        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-3">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.titleFr}
                to={isEnglish ? action.hrefEn : action.hrefFr}
                className="rounded-2xl p-5 transition-transform hover:-translate-y-0.5"
                style={{ background: '#ffffff', border: '1px solid var(--mpr-border)' }}
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#f0f4ff] text-[color:var(--mpr-primary)]">
                  <Icon className="h-6 w-6" />
                </div>
                <h2 className="!text-[24px] !mb-3">{isEnglish ? action.titleEn : action.titleFr}</h2>
                <p className="text-[18px] leading-8 text-[color:var(--mpr-text)]">
                  {isEnglish ? action.textEn : action.textFr}
                </p>
              </Link>
            );
          })}
        </section>

        <section className="mt-10">
          <div className="mb-4">
            <h2 className="mb-2">{isEnglish ? 'Start with the situation that fits you' : 'Commencez avec la situation qui vous ressemble'}</h2>
            <p className="text-[18px] leading-8 text-[color:var(--mpr-text)] max-w-4xl">
              {isEnglish
                ? 'If you are not sure which calculator to choose, start with a situation that looks like yours.'
                : 'Si vous ne savez pas quel calculateur choisir, commencez par une situation qui ressemble à la vôtre.'}
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {situations.map((item) => (
              <Link
                key={item.titleFr}
                to={isEnglish ? item.hrefEn : item.hrefFr}
                className="rounded-2xl p-5 transition-transform hover:-translate-y-0.5"
                style={{ background: '#ffffff', border: '1px solid var(--mpr-border)' }}
              >
                <h3 className="mb-2">{isEnglish ? item.titleEn : item.titleFr}</h3>
                <p className="text-[18px] leading-8 text-[color:var(--mpr-text)]">
                  {isEnglish ? item.textEn : item.textFr}
                </p>
              </Link>
            ))}
          </div>
        </section>

        <section
          className="mt-10 rounded-2xl border p-5"
          style={{ background: '#fff4ef', borderColor: '#fed7aa' }}
        >
          <div className="flex items-start gap-4">
            <div className="mt-1 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-[color:var(--mpr-warning)]">
              <PiggyBank className="h-6 w-6" />
            </div>
            <div>
              <h2 className="!text-[24px] !mb-2">
                {isEnglish ? 'Not sure where to begin?' : 'Vous ne savez pas par où commencer?'}
              </h2>
              <p className="text-[18px] leading-8 text-[color:var(--mpr-text)]">
                {isEnglish
                  ? 'Start with the guided path. It helps you complete your profile and then points you to the most useful tools.'
                  : 'Commencez par le parcours guidé. Il vous aide à remplir votre profil, puis vous dirige vers les outils les plus utiles.'}
              </p>
              <Link
                to={isEnglish ? '/start-here' : '/commencer'}
                className="mt-4 inline-flex min-h-[56px] items-center gap-2 rounded-xl px-5 text-[18px] font-semibold text-white"
                style={{ background: 'var(--mpr-primary)' }}
              >
                <span>{isEnglish ? 'Start with the guided path' : 'Commencer avec le parcours guidé'}</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </section>

        <div className="mt-12 space-y-10">
          {sections.map((section) => {
            const tools = section.toolIds
              .map((toolId) => toolsById.get(toolId))
              .filter(Boolean);

            if (tools.length === 0) {
              return null;
            }

            return (
              <section key={section.id} id={section.id}>
                <div className="mb-4">
                  <h2 className="mb-2">{isEnglish ? section.titleEn : section.titleFr}</h2>
                  <p className="text-[18px] leading-8 text-[color:var(--mpr-text)] max-w-4xl">
                    {isEnglish ? section.textEn : section.textFr}
                  </p>
                </div>
                <div className="mpr-result-grid !grid-cols-1 lg:!grid-cols-3">
                  {tools.map((tool) => (
                    <ToolCard key={tool!.id} tool={tool!} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>

        <p className="mt-12 text-[14px] leading-6 text-[color:var(--mpr-text-muted)]">
          {isEnglish
            ? 'These tools are provided for educational purposes only and should be used with your own judgment or with a qualified planner.'
            : 'Ces outils sont fournis à titre éducatif uniquement et devraient être utilisés avec votre jugement ou avec un planificateur qualifié.'}
        </p>
      </div>
    </div>
  );
}
