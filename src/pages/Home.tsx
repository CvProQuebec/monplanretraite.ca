import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Meta from '@/components/ui/Meta';
import {
  ArrowRight,
  BookOpen,
  Calculator,
  CircleDollarSign,
  ClipboardList,
  FolderOpen,
  Landmark,
  PiggyBank,
  Shield,
} from 'lucide-react';

type HeroPillar = {
  icon: React.ComponentType<{ className?: string }>;
  titleFr: string;
  titleEn: string;
  textFr: string;
  textEn: string;
  hrefFr: string;
  hrefEn: string;
};

const heroPillars: HeroPillar[] = [
  {
    icon: CircleDollarSign,
    titleFr: 'Revenus',
    titleEn: 'Income',
    textFr: 'Comprendre vos rentes, vos retraits et vos sources de revenu.',
    textEn: 'Understand pensions, withdrawals and income sources.',
    hrefFr: '/mes-revenus',
    hrefEn: '/my-income',
  },
  {
    icon: ClipboardList,
    titleFr: 'Depenses',
    titleEn: 'Expenses',
    textFr: 'Voir clair dans vos besoins mensuels et vos choix de vie.',
    textEn: 'See your monthly needs and life choices more clearly.',
    hrefFr: '/depenses',
    hrefEn: '/expenses',
  },
  {
    icon: PiggyBank,
    titleFr: 'Investissements',
    titleEn: 'Investments',
    textFr: 'Mieux organiser votre epargne, vos placements et votre marge de manoeuvre.',
    textEn: 'Organize savings, investments and long-term flexibility.',
    hrefFr: '/ma-retraite',
    hrefEn: '/my-retirement',
  },
];

const primaryCards = [
  {
    icon: ClipboardList,
    titleFr: 'Par ou commencer',
    titleEn: 'Where to start',
    textFr: 'Suivez un parcours simple, etape par etape, pour batir votre plan de retraite.',
    textEn: 'Follow a simple step-by-step path to build your retirement plan.',
    hrefFr: '/commencer',
    hrefEn: '/start-here',
  },
  {
    icon: Calculator,
    titleFr: 'Mes outils retraite',
    titleEn: 'My retirement tools',
    textFr: 'Accedez rapidement aux calculateurs pour revenus, impots, retraits et situations speciales.',
    textEn: 'Quickly access calculators for income, taxes, withdrawals and special situations.',
    hrefFr: '/outils',
    hrefEn: '/tools',
  },
  {
    icon: FolderOpen,
    titleFr: 'Mon dossier pour le planificateur',
    titleEn: 'My planner dossier',
    textFr: 'Rassemblez vos chiffres, vos resumes et vos rapports dans un meme parcours.',
    textEn: 'Gather your numbers, summaries and reports in one guided path.',
    hrefFr: '/mon-dossier',
    hrefEn: '/my-dossier',
  },
];

const situations = [
  {
    icon: CircleDollarSign,
    titleFr: 'Je veux comprendre mes revenus de retraite',
    titleEn: 'I want to understand my retirement income',
    hrefFr: '/outils#revenus',
    hrefEn: '/tools#revenus',
  },
  {
    icon: Landmark,
    titleFr: 'Je veux reduire mes impots',
    titleEn: 'I want to reduce my taxes',
    hrefFr: '/outils#impots',
    hrefEn: '/tools#impots',
  },
  {
    icon: BookOpen,
    titleFr: 'Je veux lire des guides simples',
    titleEn: 'I want to read simple guides',
    hrefFr: '/blog',
    hrefEn: '/en/blog',
  },
  {
    icon: Shield,
    titleFr: 'Je veux proteger ma famille en cas d urgence',
    titleEn: 'I want to protect my family in an emergency',
    hrefFr: '/trousse',
    hrefEn: '/kit',
  },
];

const differentiators = [
  {
    titleFr: 'Une experience claire pour les 50 ans et plus',
    titleEn: 'A clear experience for adults age 50+',
  },
  {
    titleFr: 'Des outils concrets, sans jargon inutile',
    titleEn: 'Practical tools without unnecessary jargon',
  },
  {
    titleFr: 'Un dossier plus simple a revoir avec votre planificateur',
    titleEn: 'A simpler dossier to review with your planner',
  },
];

const Home: React.FC = () => {
  const location = useLocation();
  const isEnglish = location.pathname.startsWith('/en') || location.pathname === '/home';

  return (
    <div
      className="min-h-screen"
      style={{ background: 'linear-gradient(180deg, #f4f7fb 0%, #ffffff 26%, #f8fafc 100%)' }}
    >
      <Meta
        title={
          isEnglish
            ? 'Retirement planning tools and guidance | MonPlanRetraite.ca'
            : 'Planification de retraite au Quebec | Outils et guides | MonPlanRetraite.ca'
        }
        description={
          isEnglish
            ? 'Simple retirement planning tools, calculators and guidance to understand income, expenses, investments and your planner dossier.'
            : 'Des outils simples pour planifier votre retraite, comprendre revenus, depenses, investissements et preparer votre dossier.'
        }
        lang={isEnglish ? 'en' : 'fr'}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12">
        <section
          className="relative overflow-hidden rounded-[32px] border"
          style={{
            backgroundColor: '#0f172a',
            borderColor: 'rgba(255,255,255,0.08)',
            boxShadow: '0 28px 60px -28px rgba(15,23,42,0.55)',
          }}
        >
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(90deg, rgba(15,23,42,0.94) 0%, rgba(15,23,42,0.86) 38%, rgba(15,23,42,0.58) 68%, rgba(15,23,42,0.72) 100%), url('/hero-couple.png')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          <div
            className="absolute -top-24 right-[-80px] h-72 w-72 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(245, 200, 110, 0.24) 0%, rgba(245, 200, 110, 0) 70%)' }}
          />
          <div
            className="absolute bottom-[-120px] left-[-60px] h-80 w-80 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(59, 130, 246, 0.22) 0%, rgba(59, 130, 246, 0) 72%)' }}
          />

          <div className="relative grid gap-8 px-6 py-8 md:px-10 md:py-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-end lg:px-12 lg:py-14">
            <div className="max-w-3xl">
              <div
                className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold"
                style={{ background: 'rgba(255,255,255,0.1)', color: '#f8fafc', border: '1px solid rgba(255,255,255,0.14)' }}
              >
                <span>{isEnglish ? 'Retirement, with more confidence' : 'La retraite, avec plus de confiance'}</span>
              </div>

              <h1 className="mt-6 max-w-3xl text-white">
                {isEnglish
                  ? 'Enjoy retirement with a clearer plan for income, expenses and investments'
                  : 'Profitez de votre retraite avec un plan plus clair pour vos revenus, vos depenses et vos investissements'}
              </h1>

              <p className="max-w-2xl text-[18px] leading-8 text-slate-200">
                {isEnglish
                  ? 'MonPlanRetraite.ca helps you understand your real options, organize your numbers and prepare the next conversation with your planner.'
                  : 'MonPlanRetraite.ca vous aide a comprendre vos vraies options, a organiser vos chiffres et a preparer votre prochaine discussion avec votre planificateur.'}
              </p>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Link
                  to={isEnglish ? '/start-here' : '/commencer'}
                  className="inline-flex min-h-[56px] items-center justify-center gap-2 rounded-xl px-6 text-[18px] font-semibold"
                  style={{ background: '#f6c66a', color: '#0f172a' }}
                >
                  <span>{isEnglish ? 'Start for free' : 'Commencer gratuitement'}</span>
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <Link
                  to={isEnglish ? '/tools' : '/outils'}
                  className="inline-flex min-h-[56px] items-center justify-center gap-2 rounded-xl px-6 text-[18px] font-semibold text-white"
                  style={{ border: '1px solid rgba(255,255,255,0.22)', background: 'rgba(255,255,255,0.08)' }}
                >
                  <span>{isEnglish ? 'See the retirement tools' : 'Voir les outils retraite'}</span>
                </Link>
              </div>
            </div>

            <div className="grid gap-3 lg:pb-2">
              {heroPillars.map((pillar) => {
                const Icon = pillar.icon;
                return (
                  <Link
                    key={pillar.titleFr}
                    to={isEnglish ? pillar.hrefEn : pillar.hrefFr}
                    className="group rounded-2xl p-4 transition-transform hover:-translate-y-0.5"
                    style={{
                      background: 'linear-gradient(180deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.08) 100%)',
                      border: '1px solid rgba(255,255,255,0.14)',
                      backdropFilter: 'blur(12px)',
                    }}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl"
                        style={{ background: 'rgba(246,198,106,0.18)', color: '#f6c66a' }}
                      >
                        <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="!mb-0 !text-[22px]" style={{ color: '#ffffff' }}>
                            {isEnglish ? pillar.titleEn : pillar.titleFr}
                          </h2>
                          <ArrowRight className="h-4 w-4 text-[#f6c66a] transition-transform group-hover:translate-x-1" />
                        </div>
                        <p className="mt-2 mb-0 text-[16px] leading-7 text-slate-200">
                          {isEnglish ? pillar.textEn : pillar.textFr}
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-4 md:grid-cols-3">
          {[
            isEnglish ? 'Free to get started' : '0 $ pour commencer',
            isEnglish ? 'Data stays private' : 'Donnees 100 % privees',
            isEnglish ? 'Clear next steps' : 'Des prochaines etapes claires',
          ].map((item) => (
            <div
              key={item}
              className="rounded-2xl px-5 py-4 text-center text-[16px] font-semibold"
              style={{ background: '#ffffff', border: '1px solid var(--mpr-border)', color: 'var(--mpr-h2)' }}
            >
              {item}
            </div>
          ))}
        </section>

        <section className="mt-12 grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div
            className="overflow-hidden rounded-[28px] border"
            style={{ borderColor: 'rgba(15,23,42,0.08)', boxShadow: '0 18px 40px -24px rgba(15,23,42,0.28)' }}
          >
            <img
              src="/hero-abstract.png"
              alt={isEnglish ? 'Abstract illustration representing three financial flows converging' : 'Illustration abstraite representant trois flux financiers qui convergent'}
              className="h-full w-full object-cover"
            />
          </div>

          <div>
            <div
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-base font-semibold"
              style={{ background: '#eef4ff', color: 'var(--mpr-h2)' }}
            >
              <Calculator className="h-5 w-5" />
              <span>{isEnglish ? 'The 3 keys to a calmer retirement' : 'Les 3 cles d une retraite plus sereine'}</span>
            </div>

            <h2 className="mt-5">
              {isEnglish
                ? 'Bring your financial picture together instead of managing each concern separately'
                : 'Rassembler votre portrait financier, au lieu de gerer chaque preoccupation separement'}
            </h2>

            <p className="text-[18px] leading-8 text-[color:var(--mpr-text)]">
              {isEnglish
                ? 'The goal is not to make retirement feel complicated. The goal is to connect income, expenses and investments so each decision makes more sense.'
                : 'Le but n est pas de rendre la retraite plus compliquee. Le but est de relier revenus, depenses et investissements pour que chaque decision fasse plus de sens.'}
            </p>

            <div className="mt-6 grid gap-4">
              {primaryCards.map((card) => {
                const Icon = card.icon;
                return (
                  <Link
                    key={card.titleFr}
                    to={isEnglish ? card.hrefEn : card.hrefFr}
                    className="rounded-2xl p-5 transition-transform hover:-translate-y-0.5"
                    style={{ background: '#ffffff', border: '1px solid var(--mpr-border)' }}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl"
                        style={{ background: '#f0f4ff', color: 'var(--mpr-primary)' }}
                      >
                        <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="mb-2">{isEnglish ? card.titleEn : card.titleFr}</h3>
                        <p className="mb-0 text-[17px] leading-7 text-[color:var(--mpr-text)]">
                          {isEnglish ? card.textEn : card.textFr}
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        <section className="mt-12 grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div
            className="rounded-[28px] p-6 md:p-8"
            style={{
              background: 'linear-gradient(135deg, #fff7ed 0%, #ffffff 58%, #f8fafc 100%)',
              border: '1px solid #fed7aa',
            }}
          >
            <div
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-base font-semibold"
              style={{ background: '#ffffff', color: '#9a3412', border: '1px solid #fed7aa' }}
            >
              <Shield className="h-5 w-5" />
              <span>{isEnglish ? 'Plan with more peace of mind' : 'Planifier avec plus de tranquillite'}</span>
            </div>

            <h2 className="mt-5">
              {isEnglish
                ? 'Prepare the life you want to protect, not just the numbers you need to manage'
                : 'Preparez la vie que vous voulez proteger, pas seulement les chiffres que vous devez gerer'}
            </h2>

            <p className="text-[18px] leading-8 text-[color:var(--mpr-text)]">
              {isEnglish
                ? 'Retirement planning is also about freedom, family and confidence. That is why the platform helps you move from calculations to real-life preparation.'
                : 'Planifier la retraite, c est aussi penser a la liberte, a la famille et a la confiance. C est pourquoi la plateforme vous aide a passer des calculs a une vraie preparation.'}
            </p>

            <div className="mt-6 space-y-3">
              {differentiators.map((item) => (
                <div key={item.titleFr} className="flex items-start gap-3">
                  <div
                    className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ background: '#c2410c' }}
                  />
                  <p className="mb-0 text-[17px] leading-7 text-[color:var(--mpr-text)]">
                    {isEnglish ? item.titleEn : item.titleFr}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                to={isEnglish ? '/my-dossier' : '/mon-dossier'}
                className="inline-flex min-h-[56px] items-center justify-center gap-2 rounded-xl px-6 text-[18px] font-semibold text-white"
                style={{ background: 'var(--mpr-primary)' }}
              >
                <span>{isEnglish ? 'Prepare my dossier' : 'Preparer mon dossier'}</span>
              </Link>
              <Link
                to={isEnglish ? '/kit' : '/trousse'}
                className="inline-flex min-h-[56px] items-center justify-center gap-2 rounded-xl px-6 text-[18px] font-semibold"
                style={{ border: '2px solid #c2410c', color: '#9a3412', background: '#ffffff' }}
              >
                <span>{isEnglish ? 'Protect my family' : 'Proteger ma famille'}</span>
              </Link>
            </div>
          </div>

          <div
            className="overflow-hidden rounded-[28px] border"
            style={{ borderColor: 'rgba(15,23,42,0.08)', boxShadow: '0 18px 40px -24px rgba(15,23,42,0.28)' }}
          >
            <img
              src="/hero-woman.png"
              alt={isEnglish ? 'Confident senior woman near the river at golden hour' : 'Femme agee confiante pres du fleuve a l heure doree'}
              className="h-full w-full object-cover"
            />
          </div>
        </section>

        <section className="mt-12 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div
            className="rounded-2xl p-6"
            style={{ background: '#ffffff', border: '1px solid var(--mpr-border)' }}
          >
            <h2 className="mb-4">
              {isEnglish ? 'A retirement plan in 3 simple steps' : 'Votre plan de retraite en 3 etapes simples'}
            </h2>
            <div className="space-y-4">
              {[
                isEnglish
                  ? '1. Complete your basic profile and retirement goals.'
                  : '1. Remplissez votre profil de base et vos objectifs de retraite.',
                isEnglish
                  ? '2. Use the tools that fit your real questions.'
                  : '2. Utilisez les outils qui repondent a vos vraies questions.',
                isEnglish
                  ? '3. Build a dossier and review it with your planner.'
                  : '3. Batissez un dossier et revisez-le avec votre planificateur.',
              ].map((line) => (
                <div key={line} className="flex items-start gap-3">
                  <div
                    className="mt-1 h-3 w-3 shrink-0 rounded-full"
                    style={{ background: 'var(--mpr-primary)' }}
                  />
                  <p className="text-[18px] leading-8 text-[color:var(--mpr-text)]">{line}</p>
                </div>
              ))}
            </div>
          </div>

          <div
            className="rounded-2xl p-6"
            style={{ background: '#fff4ef', border: '1px solid #fed7aa' }}
          >
            <h2 className="mb-4">{isEnglish ? 'Popular starting points' : 'Departs les plus populaires'}</h2>
            <div className="space-y-3">
              {situations.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.titleFr}
                    to={isEnglish ? item.hrefEn : item.hrefFr}
                    className="flex min-h-[56px] items-center gap-3 rounded-xl bg-white px-4 py-3"
                  >
                    <Icon className="h-5 w-5 text-[color:var(--mpr-warning)]" />
                    <span className="text-[18px] font-semibold text-[color:var(--mpr-text)]">
                      {isEnglish ? item.titleEn : item.titleFr}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
