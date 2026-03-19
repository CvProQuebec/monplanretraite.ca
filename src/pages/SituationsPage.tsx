import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Meta from '@/components/ui/Meta';
import { ArrowRight, Briefcase, HardHat, HeartHandshake, Home, Shield, Users } from 'lucide-react';

const situations = [
  {
    icon: HardHat,
    titleFr: 'Travailleur de la construction',
    titleEn: 'Construction worker',
    textFr: 'Pour les réalités de la CCQ, des périodes de travail variables et des revenus plus irréguliers.',
    textEn: 'For CCQ realities, variable work periods, and less regular income.',
    hrefFr: '/outils#situations',
    hrefEn: '/tools#situations',
  },
  {
    icon: Briefcase,
    titleFr: 'Travailleur autonome ou incorporé',
    titleEn: 'Self-employed or incorporated',
    textFr: 'Pour le REER, les revenus passifs, l’impôt et la préparation d’un plan de retraite sans régime d’employeur.',
    textEn: 'For RRSP, passive income, taxes, and retirement planning without an employer pension.',
    hrefFr: '/outils#situations',
    hrefEn: '/tools#situations',
  },
  {
    icon: Users,
    titleFr: 'Couple à la retraite',
    titleEn: 'Retired couple',
    textFr: 'Pour coordonner les revenus, le fractionnement, le FERR et la protection de la SV.',
    textEn: 'To coordinate income, splitting, RRIF decisions, and OAS protection.',
    hrefFr: '/outils#impots',
    hrefEn: '/tools#impots',
  },
  {
    icon: HeartHandshake,
    titleFr: 'Veuvage ou grande transition',
    titleEn: 'Widowhood or major transition',
    textFr: 'Pour réorganiser rapidement vos revenus, vos documents et vos priorités financières.',
    textEn: 'To quickly reorganize your income, documents, and financial priorities.',
    hrefFr: '/mon-dossier',
    hrefEn: '/my-dossier',
  },
  {
    icon: Home,
    titleFr: 'À 5 ans de la retraite',
    titleEn: 'Within 5 years of retirement',
    textFr: 'Pour préparer votre dossier, clarifier vos revenus et éviter les erreurs de dernière minute.',
    textEn: 'To prepare your dossier, clarify income, and avoid last-minute mistakes.',
    hrefFr: '/mon-dossier',
    hrefEn: '/my-dossier',
  },
  {
    icon: Shield,
    titleFr: 'Je veux protéger ma famille (urgence et succession)',
    titleEn: 'I want to protect my family (emergency and estate)',
    textFr: 'Pour préparer vos documents d\'urgence, vos volontés funéraires et votre dossier de liquidateur — en format PDF à compléter à votre rythme.',
    textEn: 'To prepare your emergency documents, funeral wishes, and executor file — as PDFs to complete at your own pace.',
    hrefFr: '/trousse',
    hrefEn: '/kit',
  },
];

const SituationsPage: React.FC = () => {
  const location = useLocation();
  const isEnglish = location.pathname.startsWith('/en') || location.pathname === '/situations';

  return (
    <div className="min-h-screen bg-[color:var(--mpr-bg-section)]">
      <Meta
        title={
          isEnglish
            ? 'Retirement planning by situation | MonPlanRetraite.ca'
            : 'Planifier sa retraite selon sa situation | MonPlanRetraite.ca'
        }
        description={
          isEnglish
            ? 'Choose the retirement path that matches your situation: self-employed, couple, construction worker, widowhood, or within 5 years of retirement.'
            : 'Choisissez un parcours retraite selon votre situation: travailleur autonome, couple, construction, veuvage ou à 5 ans de la retraite.'
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
          <h1 className="mb-4">
            {isEnglish
              ? 'Choose the retirement situation that looks most like yours'
              : 'Choisissez la situation retraite qui ressemble le plus à la vôtre'}
          </h1>
          <p className="text-[18px] leading-8 text-[color:var(--mpr-text)] max-w-4xl">
            {isEnglish
              ? 'If the site still feels too broad, start here. We grouped common retirement situations into simple entry points with the most useful tools and guides.'
              : 'Si le site vous semble encore trop large, commencez ici. Nous avons regroupé les situations de retraite les plus fréquentes en portes d’entrée simples avec les outils et guides les plus utiles.'}
          </p>
        </section>

        <section className="mt-10 grid gap-5 md:grid-cols-2">
          {situations.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.titleFr}
                to={isEnglish ? item.hrefEn : item.hrefFr}
                className="rounded-2xl p-6 transition-transform hover:-translate-y-0.5"
                style={{ background: '#ffffff', border: '1px solid var(--mpr-border)' }}
              >
                <div
                  className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl"
                  style={{ background: '#f0f4ff', color: 'var(--mpr-primary)' }}
                >
                  <Icon className="h-7 w-7" />
                </div>
                <h2 className="!text-[24px] !mb-3">{isEnglish ? item.titleEn : item.titleFr}</h2>
                <p className="text-[18px] leading-8 text-[color:var(--mpr-text)]">
                  {isEnglish ? item.textEn : item.textFr}
                </p>
                <div className="mt-4 inline-flex items-center gap-2 text-[18px] font-semibold text-[color:var(--mpr-primary)]">
                  <span>{isEnglish ? 'Open this path' : 'Ouvrir ce parcours'}</span>
                  <ArrowRight className="h-5 w-5" />
                </div>
              </Link>
            );
          })}
        </section>
      </div>
    </div>
  );
};

export default SituationsPage;
