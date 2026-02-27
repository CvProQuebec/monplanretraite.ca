import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/features/retirement/hooks/useLanguage';
import { Button } from '@/components/ui/button';
import OnboardingWizard from '@/components/ui/OnboardingWizard';
import {
  TrendingUp,
  PieChart,
  BarChart3,
  CheckCircle,
  Sparkles,
  Shield,
  ArrowRight,
  AlertCircle,
  AlertTriangle,
  Users,
  FileText,
  BookOpen,
  ChevronDown,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AdvancedUpgradeModal from '@/components/ui/advanced-upgrade-modal';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { getAllPosts } from '@/pages/blog/utils/content';
import PlansSection from '@/components/home/PlansSection';

/* ─────────────────────────────────────────────────────────
   Framer Motion helpers
───────────────────────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

const fadeLeft = {
  hidden: { opacity: 0, x: -28 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } },
};

const fadeRight = {
  hidden: { opacity: 0, x: 28 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } },
};

/* ─────────────────────────────────────────────────────────
   Component
───────────────────────────────────────────────────────── */
const Home: React.FC = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const isFr = language === 'fr';

  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [targetPlan, setTargetPlan] = useState<'professional' | 'expert'>('professional');
  const [showOnboarding, setShowOnboarding] = useState(false);

  const totalBlogCount = useMemo(
    () => getAllPosts().filter((p) => p.status === 'published').length,
    []
  );

  const handleUpgradeClick = (plan: 'professional' | 'expert') => {
    setTargetPlan(plan);
    setIsUpgradeModalOpen(true);
  };

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    navigate(isFr ? '/ma-retraite' : '/my-retirement');
  };

  /* ── Data ── */
  const pillars = [
    {
      icon: TrendingUp,
      titleFr: 'Vos Revenus',
      titleEn: 'Your Income',
      descFr: 'RRQ, PSV, pensions, REER — optimisez chaque source de revenu à la retraite.',
      descEn: 'CPP, OAS, pensions, RRSP — optimize every income source in retirement.',
      href: isFr ? '/mes-revenus' : '/my-income',
      color: '#16a34a',
      bg: '#f0fdf4',
    },
    {
      icon: PieChart,
      titleFr: 'Vos Dépenses',
      titleEn: 'Your Expenses',
      descFr: 'Budget mensuel, fonds d\'urgence, dettes — maîtrisez vos sorties d\'argent.',
      descEn: 'Monthly budget, emergency fund, debts — control your money outflows.',
      href: isFr ? '/mon-budget' : '/my-budget',
      color: '#FF6B35',
      bg: '#fff4ef',
    },
    {
      icon: BarChart3,
      titleFr: 'Vos Investissements',
      titleEn: 'Your Investments',
      descFr: 'CELI, REER, FERR — simulez, optimisez et planifiez votre horizon de placement.',
      descEn: 'TFSA, RRSP, RRIF — simulate, optimize and plan your investment horizon.',
      href: isFr ? '/ma-retraite' : '/my-retirement',
      color: '#4c6ef5',
      bg: '#f0f4ff',
    },
  ];

  const differentiators = [
    {
      icon: CheckCircle,
      titleFr: 'Gratuit pour commencer',
      titleEn: 'Free to start',
      descFr: 'Module d\'urgence professionnel offert gratuitement — une première au Québec.',
      descEn: 'Professional emergency module for free — a first in Quebec.',
      color: '#16a34a',
    },
    {
      icon: Sparkles,
      titleFr: 'Assistant IA exclusif',
      titleEn: 'Exclusive AI assistant',
      descFr: 'Le premier assistant qui prévient les catastrophes financières avant qu\'elles arrivent.',
      descEn: 'The first assistant that prevents financial disasters before they happen.',
      color: '#4c6ef5',
    },
    {
      icon: Shield,
      titleFr: 'Données 100 % privées',
      titleEn: '100% private data',
      descFr: 'Vos données restent sur votre appareil. Aucune transmission réseau. AES-256.',
      descEn: 'Your data stays on your device. No network transmission. AES-256.',
      color: '#d97706',
    },
  ];

  const faqItems = useMemo(
    () =>
      isFr
        ? [
            { q: 'Dois-je créer un compte ?', a: 'Non. Vous commencez sans inscription et pouvez enregistrer vos scénarios localement.' },
            { q: 'Mes données sont-elles sécurisées ?', a: 'Oui. Elles sont chiffrées localement (AES-256-GCM) et ne quittent jamais votre appareil.' },
            { q: 'Puis-je obtenir un remboursement ?', a: 'Oui. 14 jours pour un remboursement complet sur les plans payants.' },
            { q: 'Offrez-vous du support téléphonique ?', a: 'Non. Guides interactifs, FAQ et assistant local sont fournis.' },
            { q: 'Comment sauvegarder mes données (clé USB) ?', a: 'Export chiffré .mpru, puis copie sur clé USB sécurisée. Importez lors de la prochaine session.' },
            { q: 'Donnez-vous des conseils personnalisés ?', a: 'Non. L\'outil aide à analyser vos choix. Pour des conseils, consultez un professionnel qualifié.' },
            { q: 'La trousse remplace-t-elle un testament ?', a: 'Non. La trousse est un outil d\'organisation personnelle. MonPlanRetraite.ca recommande de consulter un notaire pour votre testament et mandat de protection.' },
          ]
        : [
            { q: 'Do I need to create an account?', a: 'No. Start without signup and save scenarios locally.' },
            { q: 'Are my data secure?', a: 'Yes. Local AES-256-GCM encryption; nothing leaves your device.' },
            { q: 'Can I get a refund?', a: 'Yes. 14-day full refund window on paid plans.' },
            { q: 'Do you offer phone support?', a: 'No. Interactive guides, FAQ and a local assistant are provided.' },
            { q: 'How do I back up my data?', a: 'Use the encrypted .mpru export, copy to USB, and import it next session.' },
            { q: 'Do you provide personalised advice?', a: 'No. Personalised advice comes from an independent professional.' },
            { q: 'Does the kit replace a will?', a: 'No. The kit is a personal organization tool. We strongly recommend consulting a notary for your will and protection mandate.' },
          ],
    [isFr]
  );

  const stats = [
    { value: '50–90', labelFr: 'ans — notre cœur de cible', labelEn: 'years old — our focus' },
    { value: '0 $', labelFr: 'Pour commencer', labelEn: 'To start' },
    { value: '100 %', labelFr: 'Données privées', labelEn: 'Private data' },
    { value: '44+', labelFr: 'Articles de guides', labelEn: 'Guide articles' },
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#ffffff', overflowX: 'hidden' }}>

      {/* ════════════════════════════════════════════════════════
          1. HERO
      ════════════════════════════════════════════════════════ */}
      <section
        style={{
          position: 'relative',
          minHeight: '92vh',
          display: 'flex',
          alignItems: 'center',
          backgroundColor: '#0f172a',
          overflow: 'hidden',
        }}
      >
        {/* Background photo */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'url(/hero-couple.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center 25%',
            backgroundRepeat: 'no-repeat',
          }}
        />
        {/* Cinematic overlay — heavy on the left, lighter on right */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(105deg, rgba(15,23,42,0.96) 0%, rgba(15,23,42,0.82) 50%, rgba(15,23,42,0.45) 100%)',
          }}
        />
        {/* Gold top accent line */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            background:
              'linear-gradient(90deg, transparent 0%, #d97706 20%, #fbbf24 50%, #d97706 80%, transparent 100%)',
          }}
        />

        {/* Content */}
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            width: '100%',
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '100px 32px 80px',
          }}
        >
          <div style={{ maxWidth: '660px' }}>

            {/* Badge pill */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: 'rgba(217,119,6,0.14)',
                border: '1px solid rgba(217,119,6,0.38)',
                borderRadius: '100px',
                padding: '7px 18px',
                marginBottom: '32px',
              }}
            >
              <span
                style={{
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  backgroundColor: '#fbbf24',
                  display: 'block',
                  boxShadow: '0 0 6px #fbbf24',
                }}
              />
              <span
                style={{
                  color: '#fbbf24',
                  fontSize: '13px',
                  fontWeight: 700,
                  letterSpacing: '0.09em',
                  textTransform: 'uppercase',
                }}
              >
                {isFr ? 'La retraite dorée — MonPlanRetraite.ca' : 'The Golden Retirement — MonPlanRetraite.ca'}
              </span>
            </motion.div>

            {/* Headline line 1 */}
            <motion.h1
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.58, delay: 0.1 }}
              style={{
                fontSize: 'clamp(38px, 5.5vw, 62px)',
                fontWeight: 900,
                color: '#ffffff',
                lineHeight: 1.1,
                letterSpacing: '-0.025em',
                margin: 0,
              }}
            >
              {isFr ? 'Profitez pleinement' : 'Enjoy your retirement'}
            </motion.h1>

            {/* Headline line 2 — golden */}
            <motion.h1
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.58, delay: 0.18 }}
              style={{
                fontSize: 'clamp(38px, 5.5vw, 62px)',
                fontWeight: 900,
                color: '#fbbf24',
                lineHeight: 1.1,
                letterSpacing: '-0.025em',
                marginTop: '4px',
                marginBottom: '28px',
              }}
            >
              {isFr ? 'de votre retraite.' : 'to the fullest.'}
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.28 }}
              style={{
                fontSize: '20px',
                color: 'rgba(255,255,255,0.78)',
                lineHeight: 1.65,
                marginBottom: '44px',
                maxWidth: '540px',
              }}
            >
              {isFr
                ? 'Maîtrisez vos revenus, dépenses et investissements. La seule plateforme québécoise conçue pour les 50 à 90 ans — gratuit pour commencer.'
                : 'Control your income, expenses and investments. The only Quebec platform built for ages 50–90 — free to start.'}
            </motion.p>

            {/* CTA buttons */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.38 }}
              className="flex flex-wrap gap-4 items-center"
            >
              <button
                onClick={() => setShowOnboarding(true)}
                className="hero-btn-primary"
                style={{
                  backgroundColor: '#4c6ef5',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '16px 32px',
                  fontSize: '18px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  minHeight: '56px',
                  boxShadow: '0 4px 20px rgba(76,110,245,0.35)',
                  transition: 'background-color 0.2s, transform 0.2s, box-shadow 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#364fc7';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 28px rgba(76,110,245,0.45)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#4c6ef5';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(76,110,245,0.35)';
                }}
              >
                {isFr ? 'Commencer gratuitement' : 'Start for free'}
                <ArrowRight size={20} />
              </button>

              <button
                onClick={() =>
                  document.getElementById('plans-section')?.scrollIntoView({ behavior: 'smooth' })
                }
                style={{
                  backgroundColor: 'transparent',
                  color: '#ffffff',
                  border: '2px solid rgba(255,255,255,0.38)',
                  borderRadius: '8px',
                  padding: '14px 28px',
                  fontSize: '18px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  minHeight: '56px',
                  transition: 'border-color 0.2s, background-color 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.85)';
                  e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.38)';
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                {isFr ? 'Voir les plans' : 'View plans'}
              </button>
            </motion.div>
          </div>
        </div>

        {/* Bounce arrow */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          style={{
            position: 'absolute',
            bottom: '32px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          <span
            style={{
              color: 'rgba(255,255,255,0.38)',
              fontSize: '11px',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
            }}
          >
            {isFr ? 'Découvrir' : 'Discover'}
          </span>
          <motion.div
            animate={{ y: [0, 7, 0] }}
            transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
          >
            <ChevronDown size={26} style={{ color: 'rgba(255,255,255,0.35)' }} />
          </motion.div>
        </motion.div>
      </section>

      {/* ════════════════════════════════════════════════════════
          2. STATS STRIP (dark continuation of hero)
      ════════════════════════════════════════════════════════ */}
      <section
        style={{
          backgroundColor: '#0b1120',
          borderTop: '1px solid rgba(255,255,255,0.05)',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
          }}
          className="grid-cols-2 md:grid-cols-4"
        >
          {stats.map((s, i) => (
            <motion.div
              key={s.value}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              style={{
                padding: '32px 24px',
                textAlign: 'center',
                borderRight: i < 3 ? '1px solid rgba(255,255,255,0.05)' : 'none',
              }}
            >
              <div
                style={{
                  fontSize: '34px',
                  fontWeight: 800,
                  color: '#fbbf24',
                  lineHeight: 1,
                  marginBottom: '8px',
                }}
              >
                {s.value}
              </div>
              <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.48)', lineHeight: 1.4 }}>
                {isFr ? s.labelFr : s.labelEn}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          3. THREE PILLARS
      ════════════════════════════════════════════════════════ */}
      <section style={{ backgroundColor: '#f8fafc', padding: '88px 32px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {/* Section header */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            style={{ textAlign: 'center', marginBottom: '60px' }}
          >
            <p
              style={{
                color: '#d97706',
                fontSize: '13px',
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                marginBottom: '12px',
              }}
            >
              {isFr ? 'Les 3 clés d\'une retraite dorée' : 'The 3 keys to a golden retirement'}
            </p>
            <h2
              style={{
                fontSize: 'clamp(28px, 4vw, 40px)',
                fontWeight: 800,
                color: '#0f172a',
                lineHeight: 1.2,
                marginBottom: '16px',
              }}
            >
              {isFr ? 'Prenez le contrôle de vos finances' : 'Take control of your finances'}
            </h2>
            <p
              style={{
                fontSize: '18px',
                color: '#64748b',
                maxWidth: '540px',
                margin: '0 auto',
                lineHeight: 1.65,
              }}
            >
              {isFr
                ? 'Trois outils puissants, conçus pour les Canadiens de 50 à 90 ans — simples, précis et 100 % privés.'
                : 'Three powerful tools, built for Canadians aged 50–90 — simple, precise and 100% private.'}
            </p>
          </motion.div>

          {/* Pillar cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pillars.map((pillar, i) => {
              const Icon = pillar.icon;
              return (
                <motion.div
                  key={pillar.titleFr}
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  role="button"
                  tabIndex={0}
                  onClick={() => navigate(pillar.href)}
                  onKeyDown={(e) => e.key === 'Enter' && navigate(pillar.href)}
                  whileHover={{ y: -8, boxShadow: '0 24px 48px -8px rgba(0,0,0,0.14)' }}
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '16px',
                    border: '1px solid #e2e8f0',
                    padding: '40px 32px',
                    cursor: 'pointer',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = pillar.color)}
                  onBlur={(e) => (e.currentTarget.style.borderColor = '#e2e8f0')}
                >
                  {/* Icon badge */}
                  <div
                    style={{
                      width: '68px',
                      height: '68px',
                      borderRadius: '16px',
                      backgroundColor: pillar.bg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '28px',
                    }}
                  >
                    <Icon size={34} style={{ color: pillar.color }} />
                  </div>

                  <h3
                    style={{
                      fontSize: '24px',
                      fontWeight: 700,
                      color: '#0f172a',
                      marginBottom: '12px',
                      lineHeight: 1.2,
                    }}
                  >
                    {isFr ? pillar.titleFr : pillar.titleEn}
                  </h3>
                  <p
                    style={{
                      fontSize: '16px',
                      color: '#64748b',
                      lineHeight: 1.65,
                      marginBottom: '32px',
                    }}
                  >
                    {isFr ? pillar.descFr : pillar.descEn}
                  </p>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      color: pillar.color,
                      fontWeight: 700,
                      fontSize: '16px',
                    }}
                  >
                    <span>{isFr ? 'Accéder' : 'Access'}</span>
                    <ArrowRight size={18} />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          4. PROTECTION FAMILIALE (dark, abstract image BG)
      ════════════════════════════════════════════════════════ */}
      <section
        style={{
          position: 'relative',
          backgroundColor: '#0f172a',
          overflow: 'hidden',
          padding: '88px 32px',
        }}
      >
        {/* Abstract image — right half, faded */}
        <div
          style={{
            position: 'absolute',
            right: 0,
            top: 0,
            bottom: 0,
            width: '50%',
            backgroundImage: 'url(/hero-abstract.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.35,
          }}
        />
        {/* Fade from left */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: '30%',
            width: '240px',
            background: 'linear-gradient(to right, #0f172a, transparent)',
            zIndex: 1,
          }}
        />

        {/* Content */}
        <div
          style={{
            position: 'relative',
            zIndex: 2,
            maxWidth: '1200px',
            margin: '0 auto',
          }}
        >
          {/* Alert banner */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '14px',
              backgroundColor: 'rgba(239,68,68,0.12)',
              border: '1px solid rgba(239,68,68,0.28)',
              borderRadius: '12px',
              padding: '16px 24px',
              marginBottom: '52px',
              maxWidth: '680px',
            }}
          >
            <div
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: '#ef4444',
                flexShrink: 0,
                boxShadow: '0 0 8px #ef4444',
              }}
            />
            <p style={{ color: '#fca5a5', fontSize: '18px', fontWeight: 600, lineHeight: 1.5, margin: 0 }}>
              {isFr
                ? 'Si quelque chose vous arrivait demain… votre famille saurait quoi faire ?'
                : 'If something happened to you tomorrow… would your family know what to do?'}
            </p>
          </motion.div>

          {/* Two-column layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start" style={{ maxWidth: '900px' }}>

            {/* Left — text */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeLeft}
            >
              <p
                style={{
                  color: '#d97706',
                  fontSize: '13px',
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  marginBottom: '12px',
                }}
              >
                {isFr ? 'Protection familiale et successorale' : 'Family & estate protection'}
              </p>
              <h2
                style={{
                  fontSize: 'clamp(26px, 3.5vw, 36px)',
                  fontWeight: 800,
                  color: '#ffffff',
                  lineHeight: 1.2,
                  marginBottom: '20px',
                }}
              >
                {isFr ? 'La Trousse de protection familiale et successorale' : 'The Family & Estate Protection Kit'}
              </h2>
              <p
                style={{
                  fontSize: '17px',
                  color: 'rgba(255,255,255,0.62)',
                  lineHeight: 1.7,
                  marginBottom: '36px',
                }}
              >
                {isFr
                  ? 'Rassemblez les bonnes informations, au bon endroit, pour les bonnes personnes. Conçu spécifiquement pour le contexte québécois (RRQ, RAMQ, liquidateur testamentaire, mandat de protection).'
                  : 'Gather the right information, in the right place, for the right people. Designed specifically for the Quebec context.'}
              </p>

              {/* Pricing chips */}
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '36px' }}>
                <div
                  style={{
                    textAlign: 'center',
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    padding: '20px 28px',
                  }}
                >
                  <div style={{ fontSize: '30px', fontWeight: 800, color: '#fbbf24', marginBottom: '4px' }}>17 $</div>
                  <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.55)' }}>
                    {isFr ? 'Formulaire A seul' : 'Form A only'}
                  </div>
                </div>
                <div
                  style={{
                    textAlign: 'center',
                    backgroundColor: 'rgba(217,119,6,0.14)',
                    border: '1px solid rgba(217,119,6,0.32)',
                    borderRadius: '12px',
                    padding: '20px 28px',
                  }}
                >
                  <div style={{ fontSize: '30px', fontWeight: 800, color: '#fbbf24', marginBottom: '4px' }}>57 $</div>
                  <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.55)' }}>
                    {isFr ? 'Trousse complète' : 'Complete kit'}
                  </div>
                </div>
              </div>

              <button
                onClick={() => navigate(isFr ? '/planification-urgence' : '/emergency-planning')}
                style={{
                  backgroundColor: '#d97706',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '15px 28px',
                  fontSize: '17px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  minHeight: '54px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  transition: 'background-color 0.2s, transform 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#b45309';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#d97706';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {isFr ? 'Découvrir la Trousse' : 'Discover the Kit'}
                <ArrowRight size={18} />
              </button>
            </motion.div>

            {/* Right — kit contents */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeRight}
              style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}
            >
              {[
                { icon: AlertCircle, titleFr: "📋 Formulaire A — En cas d'urgence ou d'inaptitude", titleEn: '📋 Form A — In case of emergency or incapacity', c: '#FF6B35' },
                { icon: Users,       titleFr: '⚰️ Formulaire B — Dossier de préparation funéraire',   titleEn: '⚰️ Form B — Funeral preparation file', c: '#fbbf24' },
                { icon: FileText,    titleFr: '🗂️ Formulaire C — Dossier complet du liquidateur',    titleEn: '🗂️ Form C — Complete liquidator file', c: '#4c6ef5' },
                { icon: BookOpen,    titleFr: "📖 Guide d'introduction inclus",                       titleEn: '📖 Introduction guide included', c: '#16a34a' },
              ].map(({ icon: Ic, titleFr, titleEn, c }) => (
                <div
                  key={titleFr}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    padding: '16px 20px',
                    backgroundColor: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    borderRadius: '12px',
                  }}
                >
                  <Ic size={22} style={{ color: c, flexShrink: 0 }} />
                  <span style={{ color: 'rgba(255,255,255,0.82)', fontSize: '16px', fontWeight: 500 }}>
                    {isFr ? titleFr : titleEn}
                  </span>
                </div>
              ))}

              <div
                style={{
                  marginTop: '8px',
                  padding: '16px 20px',
                  backgroundColor: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: '12px',
                }}
              >
                {[
                  isFr ? '✅ Contexte québécois (RRQ, RAMQ, liquidateur)' : '✅ Quebec context (RRQ, RAMQ, liquidator)',
                  isFr ? '✅ Formulaires remplissables — numérique ou papier' : '✅ Fillable forms — digital or paper',
                  isFr ? '✅ Achat unique — téléchargement immédiat' : '✅ One-time purchase — immediate download',
                ].map((item) => (
                  <p key={item} style={{ color: 'rgba(255,255,255,0.6)', fontSize: '15px', margin: '4px 0', lineHeight: 1.5 }}>
                    {item}
                  </p>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          5. PLANS SECTION
      ════════════════════════════════════════════════════════ */}
      <section id="plans-section" style={{ padding: '88px 32px', backgroundColor: '#ffffff' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <PlansSection
            onStartFree={() => setShowOnboarding(true)}
            onSelectPlan={handleUpgradeClick}
          />
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          6. DIFFÉRENTIATEURS + WOMAN PHOTO
      ════════════════════════════════════════════════════════ */}
      <section style={{ backgroundColor: '#f8fafc', padding: '88px 32px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* Left — text */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeLeft}
            >
              <p
                style={{
                  color: '#d97706',
                  fontSize: '13px',
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  marginBottom: '12px',
                }}
              >
                {isFr ? 'Pourquoi MonPlanRetraite.ca ?' : 'Why MonPlanRetraite.ca?'}
              </p>
              <h2
                style={{
                  fontSize: 'clamp(28px, 4vw, 40px)',
                  fontWeight: 800,
                  color: '#0f172a',
                  lineHeight: 1.2,
                  marginBottom: '44px',
                }}
              >
                {isFr ? 'Ce qui nous rend différents' : 'What makes us different'}
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '36px' }}>
                {differentiators.map(({ icon: Icon, titleFr, titleEn, descFr, descEn, color }, i) => (
                  <motion.div
                    key={titleFr}
                    custom={i}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeUp}
                    style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}
                  >
                    <div
                      style={{
                        width: '54px',
                        height: '54px',
                        borderRadius: '14px',
                        backgroundColor: `${color}18`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <Icon size={28} style={{ color }} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>
                        {isFr ? titleFr : titleEn}
                      </h3>
                      <p style={{ fontSize: '16px', color: '#64748b', lineHeight: 1.65 }}>
                        {isFr ? descFr : descEn}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Right — photo */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeRight}
              style={{ position: 'relative' }}
            >
              <div
                style={{
                  borderRadius: '24px',
                  overflow: 'hidden',
                  boxShadow: '0 28px 68px -12px rgba(0,0,0,0.22)',
                  maxHeight: '540px',
                  aspectRatio: '3 / 4',
                }}
              >
                <img
                  src="/hero-woman.png"
                  alt={
                    isFr
                      ? 'Retraite épanouie avec MonPlanRetraite.ca'
                      : 'Fulfilling retirement with MonPlanRetraite.ca'
                  }
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center 15%',
                    display: 'block',
                  }}
                />
              </div>

              {/* Floating info badge */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '32px',
                  left: '-24px',
                  backgroundColor: '#ffffff',
                  borderRadius: '16px',
                  padding: '18px 22px',
                  boxShadow: '0 12px 40px -4px rgba(0,0,0,0.16)',
                  border: '1px solid #e2e8f0',
                }}
              >
                <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '4px' }}>
                  {isFr ? 'Déjà utilisé par' : 'Already used by'}
                </div>
                <div style={{ fontSize: '26px', fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>
                  10 000+
                </div>
                <div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>
                  {isFr ? 'Canadiens de 50 à 90 ans' : 'Canadians aged 50–90'}
                </div>
              </div>

              {/* Gold accent dot */}
              <div
                style={{
                  position: 'absolute',
                  top: '-16px',
                  right: '-16px',
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  backgroundColor: '#fbbf24',
                  opacity: 0.18,
                }}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          7. ARTICLES CTA BAND
      ════════════════════════════════════════════════════════ */}
      <section style={{ backgroundColor: '#4c6ef5', padding: '60px 32px' }}>
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '32px',
          }}
        >
          <div>
            <h2 style={{ fontSize: '26px', fontWeight: 700, color: '#ffffff', marginBottom: '8px' }}>
              {isFr
                ? `Bibliothèque d'articles — 44+ guides`
                : `Articles library — ${totalBlogCount}+ pieces`}
            </h2>
            <p style={{ fontSize: '17px', color: 'rgba(255,255,255,0.72)', lineHeight: 1.6 }}>
              {isFr
                ? 'Accédez gratuitement à notre bibliothèque pour bien vous préparer à la retraite.'
                : 'Free access to our library to get ready for retirement.'}
            </p>
          </div>
          <button
            onClick={() => navigate(isFr ? '/blog' : '/en/blog')}
            style={{
              backgroundColor: '#ffffff',
              color: '#4c6ef5',
              border: 'none',
              borderRadius: '8px',
              padding: '14px 28px',
              fontSize: '17px',
              fontWeight: 700,
              cursor: 'pointer',
              minHeight: '52px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              whiteSpace: 'nowrap',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            {isFr ? 'Voir la bibliothèque' : 'Browse the library'}
            <ArrowRight size={18} />
          </button>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          8. AVERTISSEMENTS
      ════════════════════════════════════════════════════════ */}
      <section
        style={{
          backgroundColor: '#fffbeb',
          borderTop: '1px solid #fde68a',
          borderBottom: '1px solid #fde68a',
          padding: '40px 32px',
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <AlertTriangle size={22} style={{ color: '#d97706', flexShrink: 0 }} />
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#92400e' }}>
              {isFr ? 'Avertissements importants' : 'Important disclaimers'}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(isFr
              ? [
                  'Outil éducatif seulement : aucun conseil financier, fiscal ou juridique personnalisé.',
                  'Données 100 % locales : elles restent sur votre appareil (chiffrement AES-256).',
                  'Plans annuels uniquement.',
                ]
              : [
                  'Educational tool only: no personalised financial, tax, or legal advice.',
                  'Data 100% local: everything stays on your device (AES-256 encryption).',
                  'Annual plans only.',
                ]
            ).map((item) => (
              <div key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <AlertCircle size={18} style={{ color: '#d97706', flexShrink: 0, marginTop: '2px' }} />
                <p style={{ fontSize: '16px', color: '#78350f', lineHeight: 1.65 }}>{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          9. FAQ
      ════════════════════════════════════════════════════════ */}
      <section style={{ backgroundColor: '#ffffff', padding: '88px 32px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            style={{ textAlign: 'center', marginBottom: '52px' }}
          >
            <h2
              style={{
                fontSize: 'clamp(26px, 3.5vw, 36px)',
                fontWeight: 800,
                color: '#0f172a',
                marginBottom: '12px',
              }}
            >
              {isFr ? 'Questions fréquentes' : 'Frequently asked questions'}
            </h2>
            <p style={{ fontSize: '17px', color: '#64748b' }}>
              {isFr
                ? 'Tout ce que vous devez savoir avant de commencer.'
                : 'Everything you need to know before starting.'}
            </p>
          </motion.div>

          <Accordion type="single" collapsible>
            {faqItems.map((item, index) => (
              <AccordionItem
                key={item.q}
                value={`faq-${index}`}
                style={{ borderBottom: '1px solid #e2e8f0' }}
              >
                <AccordionTrigger
                  style={{
                    padding: '20px 0',
                    fontSize: '18px',
                    fontWeight: 600,
                    color: '#0f172a',
                    textAlign: 'left',
                  }}
                >
                  {item.q}
                </AccordionTrigger>
                <AccordionContent
                  style={{
                    fontSize: '16px',
                    color: '#64748b',
                    lineHeight: 1.7,
                    paddingBottom: '20px',
                  }}
                >
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          10. FINAL CTA
      ════════════════════════════════════════════════════════ */}
      <section
        style={{
          position: 'relative',
          backgroundColor: '#0b1120',
          padding: '88px 32px',
          textAlign: 'center',
          overflow: 'hidden',
        }}
      >
        {/* Subtle gold radial glow */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '600px',
            height: '300px',
            background: 'radial-gradient(ellipse at center, rgba(217,119,6,0.12) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          style={{ position: 'relative', zIndex: 1, maxWidth: '580px', margin: '0 auto' }}
        >
          <img
            src="/logo-planretraite.png"
            alt="MonPlanRetraite.ca"
            style={{ height: '44px', margin: '0 auto 28px', display: 'block' }}
          />
          <h2
            style={{
              fontSize: 'clamp(28px, 4vw, 42px)',
              fontWeight: 800,
              color: '#ffffff',
              lineHeight: 1.2,
              marginBottom: '16px',
            }}
          >
            {isFr ? 'Votre retraite dorée commence maintenant.' : 'Your golden retirement starts now.'}
          </h2>
          <p
            style={{
              fontSize: '18px',
              color: 'rgba(255,255,255,0.58)',
              lineHeight: 1.65,
              marginBottom: '40px',
            }}
          >
            {isFr
              ? 'Commencez gratuitement. Aucune inscription requise. Données 100 % privées.'
              : 'Start for free. No registration required. 100% private data.'}
          </p>
          <button
            onClick={() => setShowOnboarding(true)}
            style={{
              backgroundColor: '#4c6ef5',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              padding: '18px 40px',
              fontSize: '20px',
              fontWeight: 700,
              cursor: 'pointer',
              minHeight: '60px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              boxShadow: '0 4px 24px rgba(76,110,245,0.4)',
              transition: 'background-color 0.2s, transform 0.2s, box-shadow 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#364fc7';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 32px rgba(76,110,245,0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#4c6ef5';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 24px rgba(76,110,245,0.4)';
            }}
          >
            {isFr ? 'Commencer gratuitement' : 'Start for free'}
            <ArrowRight size={22} />
          </button>
        </motion.div>
      </section>

      {/* ─── Modals ─────────────────────────────────────────── */}
      <AdvancedUpgradeModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
        requiredPlan={targetPlan}
        featureName="plan_upgrade"
        currentPlan="free"
      />
      <OnboardingWizard
        isOpen={showOnboarding}
        onClose={() => setShowOnboarding(false)}
        onComplete={handleOnboardingComplete}
      />
    </div>
  );
};

export default Home;
