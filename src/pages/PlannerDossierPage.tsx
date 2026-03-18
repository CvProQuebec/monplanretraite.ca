import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Meta from '@/components/ui/Meta';
import {
  ArrowRight,
  Calculator,
  CheckCircle2,
  FileText,
  FolderOpen,
  Save,
  UserRound,
} from 'lucide-react';

const steps = [
  {
    icon: UserRound,
    titleFr: 'Votre profil',
    titleEn: 'Your profile',
    textFr: 'Commencez par vos renseignements personnels, votre âge et votre horizon de retraite.',
    textEn: 'Start with your personal information, your age and your retirement horizon.',
    hrefFr: '/wizard/profil',
    hrefEn: '/wizard/profil',
  },
  {
    icon: Calculator,
    titleFr: 'Vos revenus et vos actifs',
    titleEn: 'Your income and assets',
    textFr: 'Ajoutez vos revenus, vos épargnes et vos principales dépenses pour obtenir un portrait clair.',
    textEn: 'Add your income, savings and main expenses to build a clear picture.',
    hrefFr: '/wizard/revenus',
    hrefEn: '/wizard/revenus',
  },
  {
    icon: FileText,
    titleFr: 'Votre plan et vos rapports',
    titleEn: 'Your plan and reports',
    textFr: 'Générez un résumé que vous pourrez revoir avec votre planificateur financier.',
    textEn: 'Generate a summary you can review with your financial planner.',
    hrefFr: '/fr/rapports-retraite',
    hrefEn: '/en/retirement-reports',
  },
];

const actionCards = [
  {
    icon: FolderOpen,
    titleFr: 'Ouvrir mon parcours guidé',
    titleEn: 'Open my guided path',
    hrefFr: '/wizard/profil',
    hrefEn: '/wizard/profil',
  },
  {
    icon: FileText,
    titleFr: 'Voir mes rapports',
    titleEn: 'View my reports',
    hrefFr: '/fr/rapports-retraite',
    hrefEn: '/en/retirement-reports',
  },
  {
    icon: Save,
    titleFr: 'Sauvegarder mes données',
    titleEn: 'Save my data',
    hrefFr: '/fr/sauvegarder-charger',
    hrefEn: '/en/save-load',
  },
];

const dossierChecklistFr = [
  'Vos revenus prévus à la retraite',
  'Vos actifs enregistrés et non enregistrés',
  'Votre budget de retraite',
  'Vos hypothèses de retrait',
  'Un rapport ou un résumé imprimable',
];

const dossierChecklistEn = [
  'Your expected retirement income',
  'Your registered and non-registered assets',
  'Your retirement budget',
  'Your withdrawal assumptions',
  'A printable report or summary',
];

const PlannerDossierPage: React.FC = () => {
  const location = useLocation();
  const isEnglish = location.pathname.startsWith('/en') || location.pathname === '/my-dossier';

  return (
    <div className="min-h-screen bg-[color:var(--mpr-bg-section)]">
      <Meta
        title={
          isEnglish
            ? 'Prepare your retirement dossier for a planner | MonPlanRetraite.ca'
            : 'Préparer votre dossier retraite pour un planificateur | MonPlanRetraite.ca'
        }
        description={
          isEnglish
            ? 'Gather your retirement income, assets, budget and reports in one clear dossier for your financial planner.'
            : 'Rassemblez vos revenus, vos actifs, votre budget et vos rapports retraite dans un dossier clair pour votre planificateur financier.'
        }
        lang={isEnglish ? 'en' : 'fr'}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 md:py-14 space-y-10">
        <section
          className="rounded-3xl p-6 md:p-10"
          style={{
            background: 'linear-gradient(135deg, #ffffff 0%, #f0f4ff 100%)',
            border: '1px solid var(--mpr-border)',
            boxShadow: '0 10px 15px -3px rgba(0,0,0,0.08), 0 4px 6px -2px rgba(0,0,0,0.05)',
          }}
        >
          <div className="max-w-3xl">
            <div
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-base font-semibold"
              style={{ background: '#e3f2fd', color: 'var(--mpr-h2)' }}
            >
              <FolderOpen className="h-5 w-5" />
              <span>{isEnglish ? 'My planner dossier' : 'Mon dossier pour le planificateur'}</span>
            </div>
            <h1 className="mt-5 mb-4">
              {isEnglish
                ? 'Prepare a clear retirement dossier before meeting your planner'
                : 'Préparez un dossier retraite clair avant votre rendez-vous'}
            </h1>
            <p className="text-[18px] leading-8 text-[color:var(--mpr-text)]">
              {isEnglish
                ? 'This section helps you prepare a clear retirement summary. The goal is not to replace your planner, but to help you arrive organized, ask better questions and save time.'
                : 'Cette section vous aide à préparer un résumé clair de votre retraite. Le but n’est pas de remplacer votre planificateur, mais de vous aider à arriver préparé, à poser de meilleures questions et à gagner du temps.'}
            </p>
            <p className="mt-4 text-[16px] leading-7 text-[color:var(--mpr-text-muted)]">
              {isEnglish
                ? 'A good dossier often leads to a more useful first meeting.'
                : 'Un bon dossier mène souvent à un premier rendez-vous beaucoup plus utile.'}
            </p>
          </div>
        </section>

        <section>
          <h2 className="mb-4">{isEnglish ? 'What to bring to your meeting' : 'Quoi apporter à votre rendez-vous'}</h2>
          <div
            className="rounded-2xl p-6"
            style={{ background: '#ffffff', border: '1px solid var(--mpr-border)' }}
          >
            <div className="grid gap-4 md:grid-cols-2">
              {(isEnglish ? dossierChecklistEn : dossierChecklistFr).map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 shrink-0 text-green-600" />
                  <p className="text-[18px] leading-8 text-[color:var(--mpr-text)]">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section>
          <h2 className="mb-4">{isEnglish ? 'Best order to prepare it' : 'Le meilleur ordre pour le préparer'}</h2>
          <div className="grid gap-5 md:grid-cols-3">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <Link
                  key={step.titleFr}
                  to={isEnglish ? step.hrefEn : step.hrefFr}
                  className="rounded-2xl p-6 transition-transform hover:-translate-y-0.5"
                  style={{ background: '#ffffff', border: '1px solid var(--mpr-border)' }}
                >
                  <div className="mb-4 flex items-center gap-3">
                    <div
                      className="flex h-12 w-12 items-center justify-center rounded-xl"
                      style={{ background: '#f0f4ff', color: 'var(--mpr-primary)' }}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                    <div
                      className="flex h-9 w-9 items-center justify-center rounded-full text-base font-bold text-white"
                      style={{ background: 'var(--mpr-primary)' }}
                    >
                      {index + 1}
                    </div>
                  </div>
                  <h3 className="mb-3">{isEnglish ? step.titleEn : step.titleFr}</h3>
                  <p className="text-[18px] leading-8 text-[color:var(--mpr-text)]">
                    {isEnglish ? step.textEn : step.textFr}
                  </p>
                </Link>
              );
            })}
          </div>
        </section>

        <section>
          <h2 className="mb-4">{isEnglish ? 'Quick actions to move forward' : 'Actions rapides pour avancer'}</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {actionCards.map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.titleFr}
                  to={isEnglish ? action.hrefEn : action.hrefFr}
                  className="flex min-h-[72px] items-center justify-between rounded-2xl px-5 py-4"
                  style={{ background: '#ffffff', border: '1px solid var(--mpr-border)' }}
                >
                  <div className="flex items-center gap-4">
                    <Icon className="h-6 w-6 text-[color:var(--mpr-primary)]" />
                    <span className="text-[18px] font-semibold text-[color:var(--mpr-text)]">
                      {isEnglish ? action.titleEn : action.titleFr}
                    </span>
                  </div>
                  <ArrowRight className="h-5 w-5 text-[color:var(--mpr-primary)]" />
                </Link>
              );
            })}
          </div>
        </section>

        <p className="text-[14px] leading-6 text-[color:var(--mpr-text-muted)]">
          {isEnglish
            ? 'These tools are provided for educational purposes only and do not replace a personalized review by a qualified professional.'
            : 'Ces outils sont fournis à titre éducatif uniquement et ne remplacent pas une révision personnalisée par un professionnel qualifié.'}
        </p>
      </div>
    </div>
  );
};

export default PlannerDossierPage;
