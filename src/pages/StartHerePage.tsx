import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Meta from '@/components/ui/Meta';
import {
  ArrowRight,
  BookOpen,
  Calculator,
  ClipboardList,
  Compass,
  FileText,
  FolderOpen,
} from 'lucide-react';

type StepCard = {
  icon: React.ComponentType<{ className?: string }>;
  titleFr: string;
  titleEn: string;
  textFr: string;
  textEn: string;
  hrefFr: string;
  hrefEn: string;
  ctaFr: string;
  ctaEn: string;
};

const steps: StepCard[] = [
  {
    icon: ClipboardList,
    titleFr: '1. Commencez par votre profil',
    titleEn: '1. Start with your profile',
    textFr: 'Entrez vos renseignements de base pour bâtir votre plan de retraite pas à pas.',
    textEn: 'Enter your basic information to build your retirement plan step by step.',
    hrefFr: '/wizard/profil',
    hrefEn: '/wizard/profil',
    ctaFr: 'Remplir mon profil',
    ctaEn: 'Fill in my profile',
  },
  {
    icon: Calculator,
    titleFr: '2. Choisissez les bons outils',
    titleEn: '2. Choose the right tools',
    textFr: 'Accédez aux calculateurs regroupés par besoin: revenus, impôt, budget et retraits.',
    textEn: 'Access calculators grouped by need: income, taxes, budget and withdrawals.',
    hrefFr: '/outils',
    hrefEn: '/tools',
    ctaFr: 'Voir les outils',
    ctaEn: 'See the tools',
  },
  {
    icon: FolderOpen,
    titleFr: '3. Préparez votre dossier',
    titleEn: '3. Prepare your dossier',
    textFr: 'Rassemblez vos informations et vos rapports pour votre rendez-vous avec un planificateur.',
    textEn: 'Gather your information and reports for your meeting with a planner.',
    hrefFr: '/mon-dossier',
    hrefEn: '/my-dossier',
    ctaFr: 'Préparer mon dossier',
    ctaEn: 'Prepare my dossier',
  },
];

const quickLinks = [
  {
    icon: Compass,
    titleFr: 'Je veux savoir par où commencer',
    titleEn: 'I want to know where to begin',
    hrefFr: '/wizard/profil',
    hrefEn: '/wizard/profil',
  },
  {
    icon: Calculator,
    titleFr: 'Je veux évaluer ma situation',
    titleEn: 'I want to assess my situation',
    hrefFr: '/outils#evaluation',
    hrefEn: '/tools#evaluation',
  },
  {
    icon: FileText,
    titleFr: 'Je veux préparer mon rendez-vous',
    titleEn: 'I want to prepare for my meeting',
    hrefFr: '/mon-dossier',
    hrefEn: '/my-dossier',
  },
  {
    icon: BookOpen,
    titleFr: 'Je veux lire des guides simples',
    titleEn: 'I want to read simple guides',
    hrefFr: '/blog',
    hrefEn: '/en/blog',
  },
];

const cardStyle: React.CSSProperties = {
  border: '1px solid var(--mpr-border)',
  borderRadius: '16px',
  background: '#ffffff',
  boxShadow: '0 10px 15px -3px rgba(0,0,0,0.08), 0 4px 6px -2px rgba(0,0,0,0.05)',
};

const StartHerePage: React.FC = () => {
  const location = useLocation();
  const isEnglish = location.pathname.startsWith('/en') || location.pathname === '/start-here';

  return (
    <div
      className="min-h-screen"
      style={{ background: 'linear-gradient(180deg, #f8fafc 0%, #ffffff 28%, #f8fafc 100%)' }}
    >
      <Meta
        title={
          isEnglish
            ? 'Where to start retirement planning | MonPlanRetraite.ca'
            : 'Par où commencer pour planifier sa retraite | MonPlanRetraite.ca'
        }
        description={
          isEnglish
            ? 'A simple step-by-step path to start retirement planning, choose the right tools and prepare your planner dossier.'
            : 'Un parcours simple pour commencer votre planification de retraite, choisir les bons outils et préparer votre dossier.'
        }
        lang={isEnglish ? 'en' : 'fr'}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 md:py-14">
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
              <Compass className="h-5 w-5" />
              <span>{isEnglish ? 'Start here' : 'Commencer ici'}</span>
            </div>
            <h1 className="mt-5 mb-4">
              {isEnglish
                ? 'Where to start if retirement planning feels overwhelming'
                : 'Par où commencer si la planification de la retraite vous semble compliquée'}
            </h1>
            <p className="text-[18px] leading-8 text-[color:var(--mpr-text)] max-w-2xl">
              {isEnglish
                ? 'We guide you step by step so you can understand your situation, choose the right retirement tools, and build a clear dossier for your planner.'
                : 'Nous vous guidons étape par étape pour comprendre votre situation, choisir les bons outils retraite et bâtir un dossier clair pour votre planificateur.'}
            </p>
            <p className="mt-4 text-[16px] leading-7 text-[color:var(--mpr-text-muted)] max-w-2xl">
              {isEnglish
                ? 'Start with one small step. You do not need to understand everything before beginning.'
                : 'Commencez par une petite étape. Vous n’avez pas besoin de tout comprendre avant de commencer.'}
            </p>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="mb-4">{isEnglish ? 'Your 3-step retirement path' : 'Votre parcours retraite en 3 étapes'}</h2>
          <div className="grid gap-5 md:grid-cols-3">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <div key={step.titleFr} className="p-6 flex flex-col" style={cardStyle}>
                  <div
                    className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl"
                    style={{ background: '#f0f4ff', color: 'var(--mpr-primary)' }}
                  >
                    <Icon className="h-7 w-7" />
                  </div>
                  <h3 className="mb-3">{isEnglish ? step.titleEn : step.titleFr}</h3>
                  <p className="text-[18px] leading-8 text-[color:var(--mpr-text)] flex-1">
                    {isEnglish ? step.textEn : step.textFr}
                  </p>
                  <Link
                    to={isEnglish ? step.hrefEn : step.hrefFr}
                    className="mt-5 inline-flex min-h-[56px] items-center justify-center gap-2 rounded-xl px-5 text-[18px] font-semibold text-white"
                    style={{ background: 'var(--mpr-primary)' }}
                  >
                    <span>{isEnglish ? step.ctaEn : step.ctaFr}</span>
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </div>
              );
            })}
          </div>
        </section>

        <section className="mt-10">
          <h2 className="mb-4">{isEnglish ? 'Choose the need that fits you now' : 'Choisissez le besoin qui vous ressemble maintenant'}</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {quickLinks.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.titleFr}
                  to={isEnglish ? item.hrefEn : item.hrefFr}
                  className="flex min-h-[72px] items-center gap-4 rounded-2xl px-5 py-4 transition-transform hover:-translate-y-0.5"
                  style={cardStyle}
                >
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-xl"
                    style={{ background: '#fff4ef', color: 'var(--mpr-warning)' }}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="text-[18px] font-semibold text-[color:var(--mpr-text)]">
                    {isEnglish ? item.titleEn : item.titleFr}
                  </span>
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
};

export default StartHerePage;
