/**
 * TroussePage — Trousse de protection familiale et successorale
 * Page dédiée à la vente de la trousse, avec 8 sections :
 * 1. Hero émotionnel
 * 2. Réalité choc (statistiques)
 * 3. Solution (4 composantes)
 * 4. Options et prix
 * 5. Réassurance
 * 6. FAQ accordéon
 * 7. Transition vers l'abonnement
 * 8. CTA final
 */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, type Variants } from 'framer-motion';
import {
  ShieldAlert,
  Flower2,
  Lock,
  BookOpen,
  Shield,
  Scale,
  FileEdit,
  CheckCircle2,
  ChevronDown,
  ArrowRight,
} from 'lucide-react';
import { useLanguage } from '@/features/retirement/hooks/useLanguage';

/* ─── DPD Purchase Links (FR links kept temporarily during EN translation) ─── */
const DPD_FORM_A =
  'https://monplanretraite-ca.dpdcart.com/cart/add?product_id=249036&method_id=272002&return=1';
const DPD_TROUSSE =
  'https://monplanretraite-ca.dpdcart.com/cart/add?product_id=249037&method_id=272003&return=1';

/* ─── Animation helpers ─── */
const EASE_CUBIC: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.08, ease: EASE_CUBIC },
  }),
};

const fadeLeft: Variants = {
  hidden: { opacity: 0, x: -24 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: EASE_CUBIC } },
};

const fadeRight: Variants = {
  hidden: { opacity: 0, x: 24 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: EASE_CUBIC } },
};

/* ─── Shared styles ─── */
const containerStyle: React.CSSProperties = {
  maxWidth: '1100px',
  margin: '0 auto',
  padding: '0 24px',
};

const sectionLabelStyle: React.CSSProperties = {
  color: '#d97706',
  fontSize: '13px',
  fontWeight: 700,
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  marginBottom: '12px',
};

/* ─── Purchase Button Components ─── */
function BtnPrimary({
  href,
  children,
  fullWidth,
}: {
  href: string;
  children: React.ReactNode;
  fullWidth?: boolean;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: fullWidth ? 'flex' : 'inline-flex',
        width: fullWidth ? '100%' : undefined,
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        backgroundColor: '#4c6ef5',
        color: '#ffffff',
        fontWeight: 700,
        fontSize: '17px',
        padding: '16px 24px',
        borderRadius: '8px',
        textDecoration: 'none',
        minHeight: '56px',
        boxShadow: '0 4px 14px rgba(76,110,245,0.35)',
        transition: 'background-color 0.2s ease, transform 0.15s ease',
        boxSizing: 'border-box',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.backgroundColor = '#364fc7';
        (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.backgroundColor = '#4c6ef5';
        (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
      }}
    >
      {children}
    </a>
  );
}

function BtnSecondary({
  href,
  children,
  fullWidth,
}: {
  href: string;
  children: React.ReactNode;
  fullWidth?: boolean;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: fullWidth ? 'flex' : 'inline-flex',
        width: fullWidth ? '100%' : undefined,
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        backgroundColor: '#ffffff',
        color: '#4c6ef5',
        fontWeight: 700,
        fontSize: '17px',
        padding: '16px 24px',
        borderRadius: '8px',
        textDecoration: 'none',
        minHeight: '56px',
        border: '2px solid #4c6ef5',
        transition: 'background-color 0.2s ease, transform 0.15s ease',
        boxSizing: 'border-box',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.backgroundColor = '#f0f4ff';
        (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.backgroundColor = '#ffffff';
        (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
      }}
    >
      {children}
    </a>
  );
}

/* ─── FAQ Accordion Item ─── */
function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      style={{
        border: '1px solid #e2e8f0',
        borderRadius: '8px',
        overflow: 'hidden',
        backgroundColor: '#ffffff',
      }}
    >
      <button
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          padding: '20px 24px',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
          minHeight: '48px',
        }}
      >
        <span style={{ fontSize: '18px', fontWeight: 600, color: '#1a365d', lineHeight: 1.4 }}>
          {question}
        </span>
        <ChevronDown
          size={20}
          style={{
            color: '#4c6ef5',
            flexShrink: 0,
            transition: 'transform 0.25s ease',
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        />
      </button>
      {open && (
        <div
          style={{
            padding: '0 24px 20px',
            fontSize: '17px',
            color: '#64748b',
            lineHeight: 1.7,
            borderTop: '1px solid #f1f5f9',
          }}
        >
          {answer}
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════ */
export default function TroussePage() {
  const { language } = useLanguage();
  const isFr = language === 'fr';

  return (
    <div style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", color: '#1a365d' }}>

      {/* ════════════════════════════════════════════════════
          SECTION 1 — HERO (impact émotionnel)
      ════════════════════════════════════════════════════ */}
      <section
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1a2f5a 50%, #1e3a8a 100%)',
          padding: '96px 24px 80px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background radial glows */}
        <div style={{
          position: 'absolute', top: '20%', right: '10%',
          width: '480px', height: '480px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(76,110,245,0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: '10%', left: '5%',
          width: '360px', height: '360px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(217,119,6,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ ...containerStyle, textAlign: 'center', position: 'relative' }}>
          <motion.p initial="hidden" animate="visible" variants={fadeUp} style={sectionLabelStyle}>
            {isFr ? 'Protection familiale et successorale' : 'Family & estate protection'}
          </motion.p>

          <motion.h1
            initial="hidden" animate="visible" custom={1} variants={fadeUp}
            style={{
              fontSize: 'clamp(28px, 4.5vw, 48px)', fontWeight: 800,
              color: '#ffffff', lineHeight: 1.2, letterSpacing: '0.3px',
              margin: '0 auto 24px', maxWidth: '800px',
            }}
          >
            {isFr
              ? <>Si quelque chose vous arrivait demain…<br /><span style={{ color: '#fbbf24' }}>votre famille saurait quoi faire ?</span></>
              : <>If something happened to you tomorrow…<br /><span style={{ color: '#fbbf24' }}>would your family know what to do?</span></>
            }
          </motion.h1>

          <motion.p
            initial="hidden" animate="visible" custom={2} variants={fadeUp}
            style={{
              fontSize: '19px', color: 'rgba(255,255,255,0.72)',
              lineHeight: 1.7, maxWidth: '640px', margin: '0 auto',
            }}
          >
            {isFr
              ? <>Votre famille mérite mieux que le chaos et les questions sans réponses.<br />En quelques heures, donnez-leur tout ce dont ils auront besoin — au moment où ils en auront le plus besoin.</>
              : <>Your family deserves better than chaos and unanswered questions.<br />In just a few hours, give them everything they'll need — right when they need it most.</>
            }
          </motion.p>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          SECTION 2 — RÉALITÉ CHOC (statistiques)
      ════════════════════════════════════════════════════ */}
      <section style={{ backgroundColor: '#1a365d', padding: '80px 24px' }}>
        <div style={containerStyle}>
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            style={{ textAlign: 'center', marginBottom: '56px' }}
          >
            <p style={{ ...sectionLabelStyle, color: '#fbbf24' }}>
              {isFr ? 'Statistiques officielles' : 'Official statistics'}
            </p>
            <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 36px)', fontWeight: 800, color: '#ffffff', lineHeight: 1.25 }}>
              {isFr ? 'La réalité que peu de familles anticipent' : 'The reality few families anticipate'}
            </h2>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            {(isFr ? [
              { stat: '65 %', desc: 'des Canadiens n\'ont pas de mandat de protection à jour', source: 'Chambre des notaires du Québec' },
              { stat: '6 mois', desc: 'c\'est le temps moyen qu\'un liquidateur passe à chercher les documents essentiels d\'une succession', source: '' },
              { stat: 'Des milliers de dollars', desc: 'en frais juridiques évitables quand les volontés du défunt ne sont pas documentées', source: '' },
            ] : [
              { stat: '65%', desc: 'of Canadians don\'t have an up-to-date protection mandate', source: 'Chambre des notaires du Québec' },
              { stat: '6 months', desc: 'is the average time an estate executor spends searching for essential documents', source: '' },
              { stat: 'Thousands of dollars', desc: 'in avoidable legal fees when the deceased\'s wishes are not documented', source: '' },
            ]).map((item, i) => (
              <motion.div
                key={i}
                initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} variants={fadeUp}
                style={{
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px', padding: '36px 28px', textAlign: 'center',
                }}
              >
                <div style={{ fontSize: 'clamp(28px, 3vw, 40px)', fontWeight: 800, color: '#fbbf24', lineHeight: 1.1, marginBottom: '16px' }}>
                  {item.stat}
                </div>
                <p style={{ fontSize: '17px', color: 'rgba(255,255,255,0.75)', lineHeight: 1.6, margin: '0 0 12px' }}>
                  {item.desc}
                </p>
                {item.source && (
                  <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', fontStyle: 'italic', margin: 0 }}>
                    {isFr ? 'Source' : 'Source'} : {item.source}
                  </p>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          SECTION 3 — LA SOLUTION (4 composantes)
      ════════════════════════════════════════════════════ */}
      <section style={{ backgroundColor: '#f8fafc', padding: '88px 24px' }}>
        <div style={containerStyle}>
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            style={{ textAlign: 'center', marginBottom: '56px' }}
          >
            <p style={sectionLabelStyle}>
              {isFr ? 'Ce qui est inclus' : "What's included"}
            </p>
            <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 36px)', fontWeight: 800, color: '#1a365d', marginBottom: '16px', lineHeight: 1.25 }}>
              {isFr ? 'La Trousse de protection familiale et successorale' : 'The Family & Estate Protection Kit'}
            </h2>
            <p style={{ fontSize: '18px', color: '#64748b', maxWidth: '680px', margin: '0 auto', lineHeight: 1.6, fontStyle: 'italic' }}>
              {isFr
                ? 'Quatre documents conçus pour le contexte juridique québécois. Une seule fois à compléter. Une paix d\'esprit pour toute la vie.'
                : 'Four documents designed for the Quebec legal context. Complete once. Peace of mind for life.'
              }
            </p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            {[
              {
                icon: ShieldAlert, color: '#FF6B35', bgColor: '#fff4f0', borderColor: '#ffd4c2',
                labelFr: 'Formulaire A', labelEn: 'Form A',
                titleFr: 'En cas d\'urgence ou d\'inaptitude', titleEn: 'In case of emergency or incapacity',
                descFr: 'Contacts d\'urgence, informations médicales, mandataire désigné, directives médicales. Le document que les premiers répondants et votre famille chercheront en premier.',
                descEn: 'Emergency contacts, medical information, designated agent, medical directives. The document first responders and your family will look for first.',
                badgeFr: 'Inclus dans les deux options', badgeEn: 'Included in both options',
                badgeBg: '#e3f2fd', badgeColor: '#1e3a8a',
              },
              {
                icon: Flower2, color: '#fbbf24', bgColor: '#fffbeb', borderColor: '#fde68a',
                labelFr: 'Formulaire B', labelEn: 'Form B',
                titleFr: 'Vos volontés funéraires', titleEn: 'Your funeral wishes',
                descFr: 'Vos préférences pour les arrangements funéraires, l\'avis de décès, la cérémonie. Évitez à votre famille de prendre ces décisions difficiles dans la douleur.',
                descEn: 'Your preferences for funeral arrangements, death notice, and ceremony. Spare your family from making these difficult decisions in grief.',
                badgeFr: 'Trousse complète', badgeEn: 'Complete kit',
                badgeBg: '#fef3c7', badgeColor: '#92400e',
              },
              {
                icon: Lock, color: '#4c6ef5', bgColor: '#f0f4ff', borderColor: '#c7d2fe',
                labelFr: 'Formulaire C', labelEn: 'Form C',
                titleFr: 'Dossier complet du liquidateur', titleEn: 'Complete executor file',
                descFr: 'Comptes bancaires, assurances, propriétés, mots de passe, testament. Le document le plus complet — à conserver dans un endroit sécurisé, jamais remis directement au liquidateur.',
                descEn: 'Bank accounts, insurance, properties, passwords, will. The most complete document — to be kept in a secure location, never handed directly to the executor.',
                badgeFr: 'Trousse complète', badgeEn: 'Complete kit',
                badgeBg: '#fef3c7', badgeColor: '#92400e',
              },
              {
                icon: BookOpen, color: '#16a34a', bgColor: '#f0fdf4', borderColor: '#bbf7d0',
                labelFr: 'Guide d\'introduction', labelEn: 'Introduction guide',
                titleFr: 'Guide de mise en route', titleEn: 'Getting started guide',
                descFr: 'Instructions claires pour utiliser chaque formulaire, registre de distribution des copies, conseils de sécurité et de mise à jour.',
                descEn: 'Clear instructions for using each form, copy distribution register, security tips, and update schedule.',
                badgeFr: 'Inclus dans les deux options', badgeEn: 'Included in both options',
                badgeBg: '#e3f2fd', badgeColor: '#1e3a8a',
              },
            ].map(({ icon: Icon, color, bgColor, borderColor, labelFr, labelEn, titleFr, titleEn, descFr, descEn, badgeFr, badgeEn, badgeBg, badgeColor }, i) => (
              <motion.div
                key={i}
                initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} variants={fadeUp}
                style={{
                  backgroundColor: '#ffffff', border: `1px solid ${borderColor}`,
                  borderRadius: '12px', padding: '28px 24px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.07), 0 1px 2px rgba(0,0,0,0.04)',
                  display: 'flex', flexDirection: 'column', gap: '14px',
                }}
              >
                <div style={{
                  width: '52px', height: '52px', borderRadius: '12px',
                  backgroundColor: bgColor, display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon size={26} style={{ color }} />
                </div>
                <div>
                  <p style={{ fontSize: '12px', fontWeight: 700, color, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>
                    {isFr ? labelFr : labelEn}
                  </p>
                  <h3 style={{ fontSize: '19px', fontWeight: 700, color: '#1a365d', lineHeight: 1.3, margin: 0 }}>
                    {isFr ? titleFr : titleEn}
                  </h3>
                </div>
                <p style={{ fontSize: '16px', color: '#64748b', lineHeight: 1.65, margin: 0, flex: 1 }}>
                  {isFr ? descFr : descEn}
                </p>
                <span style={{
                  display: 'inline-block', backgroundColor: badgeBg, color: badgeColor,
                  fontSize: '13px', fontWeight: 600, padding: '4px 12px', borderRadius: '20px', alignSelf: 'flex-start',
                }}>
                  {isFr ? badgeFr : badgeEn}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          SECTION 4 — OPTIONS ET PRIX
      ════════════════════════════════════════════════════ */}
      <section style={{ backgroundColor: '#ffffff', padding: '88px 24px' }}>
        <div style={containerStyle}>
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            style={{ textAlign: 'center', marginBottom: '56px' }}
          >
            <p style={sectionLabelStyle}>
              {isFr ? 'Tarification simple et transparente' : 'Simple, transparent pricing'}
            </p>
            <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 36px)', fontWeight: 800, color: '#1a365d', lineHeight: 1.25 }}>
              {isFr ? 'Choisissez votre niveau de protection' : 'Choose your level of protection'}
            </h2>
          </motion.div>

          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '24px', maxWidth: '800px', margin: '0 auto',
          }}>
            {/* Option Essentielle */}
            <motion.div
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeLeft}
              style={{
                border: '2px solid #e2e8f0', borderRadius: '16px', padding: '36px 28px',
                display: 'flex', flexDirection: 'column', gap: '20px',
              }}
            >
              <div>
                <p style={{ fontSize: '14px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 8px' }}>
                  {isFr ? 'L\'Essentiel' : 'The Essentials'}
                </p>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                  <span style={{ fontSize: '44px', fontWeight: 800, color: '#1a365d', lineHeight: 1 }}>
                    {isFr ? '17 $' : '$17'}
                  </span>
                  <span style={{ fontSize: '15px', color: '#64748b' }}>
                    {isFr ? 'paiement unique' : 'one-time payment'}
                  </span>
                </div>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
                {(isFr ? [
                  'Formulaire A (urgence)',
                  'Guide d\'introduction',
                  'Téléchargement PDF immédiat',
                  'À remplir à votre rythme',
                ] : [
                  'Form A (emergency)',
                  'Introduction guide',
                  'Immediate PDF download',
                  'Complete at your own pace',
                ]).map(item => (
                  <li key={item} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '16px', color: '#1a365d' }}>
                    <CheckCircle2 size={18} style={{ color: '#16a34a', flexShrink: 0 }} />
                    {item}
                  </li>
                ))}
              </ul>
              <BtnSecondary href={DPD_FORM_A} fullWidth>
                {isFr ? 'Commencer ma protection — 17 $' : 'Start my protection — $17'}
              </BtnSecondary>
            </motion.div>

            {/* Trousse Complète — RECOMMANDÉ */}
            <motion.div
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeRight}
              style={{
                border: '2px solid #4c6ef5', borderRadius: '16px', padding: '36px 28px',
                display: 'flex', flexDirection: 'column', gap: '20px',
                position: 'relative', boxShadow: '0 10px 40px -8px rgba(76,110,245,0.25)',
              }}
            >
              {/* Badge RECOMMANDÉ */}
              <div style={{
                position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)',
                backgroundColor: '#4c6ef5', color: '#ffffff', fontSize: '12px', fontWeight: 700,
                letterSpacing: '0.1em', padding: '5px 18px', borderRadius: '20px', whiteSpace: 'nowrap',
              }}>
                {isFr ? '★ RECOMMANDÉ' : '★ RECOMMENDED'}
              </div>
              <div>
                <p style={{ fontSize: '14px', fontWeight: 700, color: '#4c6ef5', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 8px' }}>
                  {isFr ? 'Protection Complète' : 'Complete Protection'}
                </p>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                  <span style={{ fontSize: '44px', fontWeight: 800, color: '#1a365d', lineHeight: 1 }}>
                    {isFr ? '57 $' : '$57'}
                  </span>
                  <span style={{ fontSize: '15px', color: '#64748b' }}>
                    {isFr ? 'paiement unique' : 'one-time payment'}
                  </span>
                </div>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
                {(isFr ? [
                  'Formulaire A (urgence)',
                  'Formulaire B (funérailles)',
                  'Formulaire C (liquidateur)',
                  'Guide d\'introduction',
                  'Téléchargement PDF immédiat',
                  'À remplir à votre rythme',
                ] : [
                  'Form A (emergency)',
                  'Form B (funeral)',
                  'Form C (executor)',
                  'Introduction guide',
                  'Immediate PDF download',
                  'Complete at your own pace',
                ]).map(item => (
                  <li key={item} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '16px', color: '#1a365d' }}>
                    <CheckCircle2 size={18} style={{ color: '#4c6ef5', flexShrink: 0 }} />
                    {item}
                  </li>
                ))}
              </ul>
              <BtnPrimary href={DPD_TROUSSE} fullWidth>
                {isFr ? 'Protéger ma famille au complet — 57 $' : 'Full family protection — $57'}
              </BtnPrimary>
            </motion.div>
          </div>

          {/* Phrase d'ancrage */}
          <motion.p
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            style={{ textAlign: 'center', fontSize: '17px', color: '#64748b', fontStyle: 'italic', marginTop: '36px' }}
          >
            {isFr
              ? '"Pour le prix d\'un repas au restaurant, vous offrez à votre famille des années de sérénité."'
              : '"For the price of a restaurant meal, you give your family years of peace of mind."'
            }
          </motion.p>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          SECTION 5 — RÉASSURANCE
      ════════════════════════════════════════════════════ */}
      <section style={{ backgroundColor: '#f8fafc', padding: '80px 24px' }}>
        <div style={containerStyle}>
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            style={{ textAlign: 'center', marginBottom: '56px' }}
          >
            <h2 style={{ fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: 800, color: '#1a365d', lineHeight: 1.25 }}>
              {isFr ? 'Ce que vous devez savoir avant d\'acheter' : 'What you need to know before purchasing'}
            </h2>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
            {[
              {
                icon: Shield, color: '#4c6ef5',
                titleFr: 'Vos informations restent chez vous',
                titleEn: 'Your information stays with you',
                descFr: 'Ces documents sont des PDF que vous remplissez et conservez vous-même. Aucune information n\'est transmise, stockée ou partagée en ligne.',
                descEn: 'These documents are PDFs that you fill out and keep yourself. No information is transmitted, stored, or shared online.',
              },
              {
                icon: Scale, color: '#d97706',
                titleFr: 'Conçu pour le Québec',
                titleEn: 'Designed for Quebec',
                descFr: 'Les formulaires tiennent compte du Code civil du Québec, du mandat de protection, du rôle du liquidateur et des spécificités successorales québécoises.',
                descEn: 'The forms take into account the Quebec Civil Code, protection mandate, executor role, and Quebec estate specificities.',
              },
              {
                icon: FileEdit, color: '#16a34a',
                titleFr: 'À votre rythme',
                titleEn: 'At your own pace',
                descFr: 'Pas de délai, pas de pression. Remplissez les formulaires en plusieurs séances, mettez-les à jour quand votre situation change.',
                descEn: 'No deadline, no pressure. Fill out the forms over multiple sessions, update them when your situation changes.',
              },
              {
                icon: CheckCircle2, color: '#FF6B35',
                titleFr: 'Garantie de remboursement 30 jours',
                titleEn: '30-day money-back guarantee',
                descFr: 'Si vous n\'êtes pas satisfait pour quelque raison que ce soit, nous vous remboursons intégralement. Sans question.',
                descEn: 'If you are not satisfied for any reason whatsoever, we will refund you in full. No questions asked.',
              },
            ].map(({ icon: Icon, color, titleFr, titleEn, descFr, descEn }, i) => (
              <motion.div
                key={i}
                initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} variants={fadeUp}
                style={{
                  backgroundColor: '#ffffff', border: '1px solid #e2e8f0',
                  borderRadius: '12px', padding: '28px 24px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                }}
              >
                <div style={{
                  width: '48px', height: '48px', borderRadius: '10px',
                  backgroundColor: `${color}18`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px',
                }}>
                  <Icon size={24} style={{ color }} />
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#1a365d', marginBottom: '10px', lineHeight: 1.3 }}>
                  {isFr ? titleFr : titleEn}
                </h3>
                <p style={{ fontSize: '16px', color: '#64748b', lineHeight: 1.65, margin: 0 }}>
                  {isFr ? descFr : descEn}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          SECTION 6 — FAQ
      ════════════════════════════════════════════════════ */}
      <section style={{ backgroundColor: '#ffffff', padding: '80px 24px' }}>
        <div style={{ ...containerStyle, maxWidth: '760px' }}>
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            style={{ textAlign: 'center', marginBottom: '48px' }}
          >
            <h2 style={{ fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: 800, color: '#1a365d', lineHeight: 1.25 }}>
              {isFr ? 'Questions fréquentes' : 'Frequently asked questions'}
            </h2>
          </motion.div>

          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
          >
            {(isFr ? [
              {
                q: 'La Trousse remplace-t-elle un testament ou un mandat de protection ?',
                a: 'Non. La Trousse est complémentaire à ces documents juridiques. Elle organise et rassemble les informations essentielles pour que vos proches et votre liquidateur puissent agir rapidement et efficacement. Nous vous recommandons fortement d\'avoir aussi un testament et un mandat de protection rédigés par un notaire.',
              },
              {
                q: 'Mes informations sont-elles en sécurité ?',
                a: 'Absolument. Ces documents sont des PDF que vous téléchargez et conservez vous-même — sur votre ordinateur, dans un coffre-fort ou chez un notaire. Aucune information n\'est jamais envoyée ni stockée en ligne.',
              },
              {
                q: 'Dois-je tout remplir en une seule fois ?',
                a: 'Non. Les formulaires sont conçus pour être complétés progressivement. Commencez par les sections les plus urgentes, revenez y ajouter des informations au fil du temps.',
              },
              {
                q: 'Que se passe-t-il si ma situation change ?',
                a: 'Vous mettez simplement votre document à jour. Le Formulaire A inclut un calendrier de mise à jour. Vous n\'avez pas à racheter le produit.',
              },
              {
                q: 'Dois-je remettre le Formulaire C à mon liquidateur ?',
                a: 'Non — et c\'est intentionnel. Le Formulaire C contient vos informations les plus sensibles (comptes bancaires, mots de passe, accès). Conservez-le dans un endroit sécurisé (coffre-fort, coffret bancaire) et informez simplement votre liquidateur de son existence et de son emplacement. Il y accédera après votre décès.',
              },
              {
                q: 'En quoi est-ce différent d\'un simple fichier Word que je ferais moi-même ?',
                a: 'La Trousse a été structurée pour couvrir exhaustivement toutes les situations d\'urgence et de succession au Québec — des dizaines de sections que vous n\'auriez probablement pas pensé à inclure, avec un langage clair et des instructions pour chaque champ. C\'est des heures de travail évitées et la certitude de n\'avoir rien oublié.',
              },
            ] : [
              {
                q: 'Does the Kit replace a will or a protection mandate?',
                a: 'No. The Kit complements these legal documents. It organizes and gathers essential information so your loved ones and executor can act quickly and effectively. We strongly recommend also having a will and protection mandate drafted by a notary.',
              },
              {
                q: 'Is my information secure?',
                a: 'Absolutely. These documents are PDFs that you download and keep yourself — on your computer, in a safe, or with a notary. No information is ever sent or stored online.',
              },
              {
                q: 'Do I have to fill everything out at once?',
                a: 'No. The forms are designed to be completed gradually. Start with the most urgent sections and come back to add information over time.',
              },
              {
                q: 'What happens if my situation changes?',
                a: 'Simply update your document. Form A includes an update schedule. You do not have to repurchase the product.',
              },
              {
                q: 'Should I give Form C to my executor?',
                a: 'No — and that is intentional. Form C contains your most sensitive information (bank accounts, passwords, access). Keep it in a secure location (safe, safety deposit box) and simply inform your executor of its existence and location. They will access it after your death.',
              },
              {
                q: 'How is this different from a Word file I could make myself?',
                a: 'The Kit was structured to exhaustively cover all emergency and estate situations in Quebec — dozens of sections you probably would not have thought to include, with clear language and instructions for each field. It saves hours of work and gives you the certainty of having forgotten nothing.',
              },
            ]).map(({ q, a }) => (
              <FaqItem key={q} question={q} answer={a} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          SECTION 7 — TRANSITION ABONNEMENT
      ════════════════════════════════════════════════════ */}
      <section style={{ backgroundColor: '#e3f2fd', padding: '72px 24px', borderTop: '1px solid #bfdbfe' }}>
        <div style={{ ...containerStyle, maxWidth: '760px', textAlign: 'center' }}>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <h2 style={{ fontSize: 'clamp(22px, 3vw, 30px)', fontWeight: 800, color: '#1a365d', marginBottom: '20px', lineHeight: 1.3 }}>
              {isFr ? 'La Trousse est votre premier pas.' : 'The Kit is your first step.'}
            </h2>
            <p style={{ fontSize: '18px', color: '#1e3a8a', lineHeight: 1.7, marginBottom: '32px' }}>
              {isFr
                ? <>Une fois votre famille protégée en cas d'imprévu, la prochaine étape est de planifier sereinement votre retraite : revenus, dépenses, investissements, REER, FERR, rentes.<br /><br />MonPlanRetraite.ca est la seule plateforme québécoise qui réunit tous ces outils dans un seul endroit — et vos informations restent toujours privées, stockées localement sur votre appareil.</>
                : <>Once your family is protected in case of the unexpected, the next step is to plan your retirement with confidence: income, expenses, investments, RRSP, RRIF, annuities.<br /><br />MonPlanRetraite.ca is the only Quebec platform that brings all these tools together in one place — and your information always remains private, stored locally on your device.</>
              }
            </p>
            <Link
              to="/"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                color: '#4c6ef5', fontWeight: 700, fontSize: '17px',
                textDecoration: 'none', padding: '14px 28px',
                border: '2px solid #4c6ef5', borderRadius: '8px', minHeight: '56px',
                transition: 'background-color 0.2s ease',
              }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f0f4ff')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              {isFr ? 'Découvrir la plateforme complète' : 'Discover the full platform'} <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          SECTION 8 — CTA FINAL
      ════════════════════════════════════════════════════ */}
      <section style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1a2f5a 60%, #1e3a8a 100%)',
        padding: '88px 24px', textAlign: 'center',
      }}>
        <div style={containerStyle}>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <h2 style={{ fontSize: 'clamp(26px, 4vw, 44px)', fontWeight: 800, color: '#ffffff', marginBottom: '16px', lineHeight: 1.2 }}>
              {isFr ? 'Votre famille mérite cette protection.' : 'Your family deserves this protection.'}
            </h2>
            <p style={{ fontSize: '19px', color: 'rgba(255,255,255,0.65)', fontStyle: 'italic', marginBottom: '48px' }}>
              {isFr
                ? 'Quelques heures aujourd\'hui. Une tranquillité d\'esprit pour toute la vie.'
                : 'A few hours today. Peace of mind for life.'
              }
            </p>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <BtnPrimary href={DPD_TROUSSE}>
                {isFr ? 'Protéger ma famille au complet — 57 $' : 'Full family protection — $57'}
              </BtnPrimary>
              <BtnSecondary href={DPD_FORM_A}>
                {isFr ? 'Commencer par l\'essentiel — 17 $' : 'Start with the essentials — $17'}
              </BtnSecondary>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
