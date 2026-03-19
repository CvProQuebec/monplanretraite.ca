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
  Shield,
} from 'lucide-react';

const Home: React.FC = () => {
  const location = useLocation();
  const isEnglish = location.pathname.startsWith('/en') || location.pathname === '/home';

  const primaryCards = [
    {
      icon: ClipboardList,
      titleFr: 'Par où commencer',
      titleEn: 'Where to start',
      textFr: 'Suivez un parcours simple, étape par étape, pour bâtir votre plan de retraite.',
      textEn: 'Follow a simple step-by-step path to build your retirement plan.',
      hrefFr: '/commencer',
      hrefEn: '/start-here',
    },
    {
      icon: Calculator,
      titleFr: 'Évaluer ma situation',
      titleEn: 'Assess my situation',
      textFr: 'Trouvez rapidement les bons outils pour vos revenus, votre budget et vos retraits.',
      textEn: 'Quickly find the right tools for income, budget and withdrawals.',
      hrefFr: '/outils',
      hrefEn: '/tools',
    },
    {
      icon: FolderOpen,
      titleFr: 'Mon dossier pour le planificateur',
      titleEn: 'My planner dossier',
      textFr: 'Rassemblez vos chiffres, vos résumés et vos rapports dans un même parcours.',
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
      titleFr: 'Je veux réduire mes impôts',
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
      titleFr: 'Je veux protéger ma famille en cas d\'urgence',
      titleEn: 'I want to protect my family in case of emergency',
      hrefFr: '/trousse',
      hrefEn: '/kit',
    },
  ];

  return (
    <div
      className="min-h-screen"
      style={{ background: 'linear-gradient(180deg, #f8fafc 0%, #ffffff 28%, #f8fafc 100%)' }}
    >
      <Meta
        title={
          isEnglish
            ? 'Retirement planning tools and guidance | MonPlanRetraite.ca'
            : 'Planification de retraite au Québec | Outils et guides | MonPlanRetraite.ca'
        }
        description={
          isEnglish
            ? 'Simple retirement planning tools, calculators and guides to understand your income, taxes and retirement dossier.'
            : 'Des outils simples pour planifier votre retraite au Québec, comprendre vos revenus, réduire vos impôts et préparer votre dossier.'
        }
        lang={isEnglish ? 'en' : 'fr'}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 md:py-14">
        <section
          className="rounded-[28px] p-6 md:p-10 lg:p-12"
          style={{
            background:
              'radial-gradient(circle at top left, rgba(76,110,245,0.12), transparent 34%), radial-gradient(circle at bottom right, rgba(255,107,53,0.12), transparent 28%), linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
            border: '1px solid var(--mpr-border)',
            boxShadow: '0 10px 15px -3px rgba(0,0,0,0.08), 0 4px 6px -2px rgba(0,0,0,0.05)',
          }}
        >
          <div className="max-w-4xl">
            <div
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-base font-semibold"
              style={{ background: '#e3f2fd', color: 'var(--mpr-h2)' }}
            >
              <ClipboardList className="h-5 w-5" />
              <span>{isEnglish ? 'Retirement made simpler' : 'Planifier votre retraite, plus simplement'}</span>
            </div>

            <h1 className="mt-5 mb-4">
              {isEnglish
                ? 'Simple retirement planning tools to help you prepare with confidence'
                : 'Des outils simples pour planifier votre retraite avec confiance'}
            </h1>

            <p className="text-[18px] leading-8 text-[color:var(--mpr-text)] max-w-3xl">
              {isEnglish
                ? 'MonPlanRetraite.ca helps you understand your retirement income, assess your situation, and prepare a clear dossier to review with your financial planner.'
                : 'MonPlanRetraite.ca vous aide à comprendre vos revenus de retraite, à évaluer votre situation et à préparer un dossier clair à revoir avec votre planificateur financier.'}
            </p>

            <p className="mt-4 text-[16px] leading-7 text-[color:var(--mpr-text-muted)] max-w-3xl">
              {isEnglish
                ? 'Designed for adults age 50+ who want plain language, large text and a clear next step.'
                : 'Conçu pour les adultes de 50 ans et plus qui veulent des explications simples, une grande lisibilité et une prochaine étape claire.'}
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                to={isEnglish ? '/start-here' : '/commencer'}
                className="inline-flex min-h-[56px] items-center justify-center gap-2 rounded-xl px-6 text-[18px] font-semibold text-white"
                style={{ background: 'var(--mpr-primary)' }}
              >
                <span>{isEnglish ? 'Start my retirement plan' : 'Commencer mon plan de retraite'}</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                to={isEnglish ? '/tools' : '/outils'}
                className="inline-flex min-h-[56px] items-center justify-center gap-2 rounded-xl border-2 px-6 text-[18px] font-semibold"
                style={{ borderColor: 'var(--mpr-primary)', color: 'var(--mpr-primary)', background: '#ffffff' }}
              >
                <span>{isEnglish ? 'See the retirement tools' : 'Voir les outils retraite'}</span>
              </Link>
            </div>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="mb-4">{isEnglish ? 'Choose the easiest path for you' : 'Choisissez le parcours le plus simple pour vous'}</h2>
          <div className="grid gap-5 md:grid-cols-3">
            {primaryCards.map((card) => {
              const Icon = card.icon;
              return (
                <Link
                  key={card.titleFr}
                  to={isEnglish ? card.hrefEn : card.hrefFr}
                  className="rounded-2xl p-6 transition-transform hover:-translate-y-0.5"
                  style={{ background: '#ffffff', border: '1px solid var(--mpr-border)' }}
                >
                  <div
                    className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl"
                    style={{ background: '#f0f4ff', color: 'var(--mpr-primary)' }}
                  >
                    <Icon className="h-7 w-7" />
                  </div>
                  <h3 className="mb-3">{isEnglish ? card.titleEn : card.titleFr}</h3>
                  <p className="text-[18px] leading-8 text-[color:var(--mpr-text)]">
                    {isEnglish ? card.textEn : card.textFr}
                  </p>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div
            className="rounded-2xl p-6"
            style={{ background: '#ffffff', border: '1px solid var(--mpr-border)' }}
          >
            <h2 className="mb-4">{isEnglish ? 'A retirement plan in 3 simple steps' : 'Votre plan de retraite en 3 étapes simples'}</h2>
            <div className="space-y-4">
              {[
                isEnglish
                  ? '1. Complete your basic profile and retirement goals.'
                  : '1. Remplissez votre profil de base et vos objectifs de retraite.',
                isEnglish
                  ? '2. Use the tools that fit your real questions.'
                  : '2. Utilisez les outils qui répondent à vos vraies questions.',
                isEnglish
                  ? '3. Build a dossier and review it with your planner.'
                  : '3. Bâtissez un dossier et révisez-le avec votre planificateur.',
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
            <h2 className="mb-4">{isEnglish ? 'Popular starting points' : 'Départs les plus populaires'}</h2>
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
