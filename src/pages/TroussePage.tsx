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
import { motion } from 'framer-motion';
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

/* ─── DPD Purchase Links ─── */
const DPD_FORM_A =
  'https://monplanretraite-ca.dpdcart.com/cart/add?product_id=249036&method_id=272002&return=1';
const DPD_TROUSSE =
  'https://monplanretraite-ca.dpdcart.com/cart/add?product_id=249037&method_id=272003&return=1';

/* ─── Animation helpers ─── */
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.08, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

const fadeLeft = {
  hidden: { opacity: 0, x: -24 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } },
};

const fadeRight = {
  hidden: { opacity: 0, x: 24 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } },
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
function BtnPrimary({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        backgroundColor: '#4c6ef5',
        color: '#ffffff',
        fontWeight: 700,
        fontSize: '17px',
        padding: '16px 32px',
        borderRadius: '8px',
        textDecoration: 'none',
        minHeight: '56px',
        minWidth: '120px',
        boxShadow: '0 4px 14px rgba(76,110,245,0.35)',
        transition: 'background-color 0.2s ease, transform 0.15s ease',
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

function BtnSecondary({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        backgroundColor: '#ffffff',
        color: '#4c6ef5',
        fontWeight: 700,
        fontSize: '17px',
        padding: '16px 32px',
        borderRadius: '8px',
        textDecoration: 'none',
        minHeight: '56px',
        minWidth: '120px',
        border: '2px solid #4c6ef5',
        transition: 'background-color 0.2s ease, transform 0.15s ease',
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
        {/* Background radial glow */}
        <div style={{
          position: 'absolute',
          top: '20%',
          right: '10%',
          width: '480px',
          height: '480px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(76,110,245,0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute',
          bottom: '10%',
          left: '5%',
          width: '360px',
          height: '360px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(217,119,6,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ ...containerStyle, textAlign: 'center', position: 'relative' }}>
          <motion.p
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            style={sectionLabelStyle}
          >
            Protection familiale et successorale
          </motion.p>

          <motion.h1
            initial="hidden"
            animate="visible"
            custom={1}
            variants={fadeUp}
            style={{
              fontSize: 'clamp(28px, 4.5vw, 48px)',
              fontWeight: 800,
              color: '#ffffff',
              lineHeight: 1.2,
              letterSpacing: '0.3px',
              marginBottom: '24px',
              maxWidth: '800px',
              margin: '0 auto 24px',
            }}
          >
            Si quelque chose vous arrivait demain…<br />
            <span style={{ color: '#fbbf24' }}>votre famille saurait quoi faire ?</span>
          </motion.h1>

          <motion.p
            initial="hidden"
            animate="visible"
            custom={2}
            variants={fadeUp}
            style={{
              fontSize: '19px',
              color: 'rgba(255,255,255,0.72)',
              lineHeight: 1.7,
              maxWidth: '640px',
              margin: '0 auto',
            }}
          >
            Votre famille mérite mieux que le chaos et les questions sans réponses.<br />
            En quelques heures, donnez-leur tout ce dont ils auront besoin — au moment où ils en auront le plus besoin.
          </motion.p>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          SECTION 2 — RÉALITÉ CHOC (statistiques)
      ════════════════════════════════════════════════════ */}
      <section style={{ backgroundColor: '#1a365d', padding: '80px 24px' }}>
        <div style={containerStyle}>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            style={{ textAlign: 'center', marginBottom: '56px' }}
          >
            <p style={{ ...sectionLabelStyle, color: '#fbbf24' }}>Statistiques officielles</p>
            <h2 style={{
              fontSize: 'clamp(24px, 3.5vw, 36px)',
              fontWeight: 800,
              color: '#ffffff',
              lineHeight: 1.25,
            }}>
              La réalité que peu de familles anticipent
            </h2>
          </motion.div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
          }}>
            {[
              {
                stat: '65 %',
                desc: 'des Canadiens n\'ont pas de mandat de protection à jour',
                source: 'Chambre des notaires du Québec',
              },
              {
                stat: '6 mois',
                desc: 'c\'est le temps moyen qu\'un liquidateur passe à chercher les documents essentiels d\'une succession',
                source: '',
              },
              {
                stat: 'Des milliers de dollars',
                desc: 'en frais juridiques évitables quand les volontés du défunt ne sont pas documentées',
                source: '',
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                variants={fadeUp}
                style={{
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                  padding: '36px 28px',
                  textAlign: 'center',
                }}
              >
                <div style={{
                  fontSize: 'clamp(28px, 3vw, 40px)',
                  fontWeight: 800,
                  color: '#fbbf24',
                  lineHeight: 1.1,
                  marginBottom: '16px',
                }}>
                  {item.stat}
                </div>
                <p style={{ fontSize: '17px', color: 'rgba(255,255,255,0.75)', lineHeight: 1.6, margin: '0 0 12px' }}>
                  {item.desc}
                </p>
                {item.source && (
                  <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', fontStyle: 'italic', margin: 0 }}>
                    Source : {item.source}
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
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            style={{ textAlign: 'center', marginBottom: '56px' }}
          >
            <p style={sectionLabelStyle}>Ce qui est inclus</p>
            <h2 style={{
              fontSize: 'clamp(24px, 3.5vw, 36px)',
              fontWeight: 800,
              color: '#1a365d',
              marginBottom: '16px',
              lineHeight: 1.25,
            }}>
              La Trousse de protection familiale et successorale
            </h2>
            <p style={{ fontSize: '18px', color: '#64748b', maxWidth: '680px', margin: '0 auto', lineHeight: 1.6, fontStyle: 'italic' }}>
              Quatre documents conçus pour le contexte juridique québécois. Une seule fois à compléter. Une paix d'esprit pour toute la vie.
            </p>
          </motion.div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
          }}>
            {[
              {
                icon: ShieldAlert,
                color: '#FF6B35',
                bgColor: '#fff4f0',
                borderColor: '#ffd4c2',
                title: 'En cas d\'urgence ou d\'inaptitude',
                desc: 'Contacts d\'urgence, informations médicales, mandataire désigné, directives médicales. Le document que les premiers répondants et votre famille chercheront en premier.',
                badge: 'Inclus dans les deux options',
                badgeBg: '#e3f2fd',
                badgeColor: '#1e3a8a',
                label: 'Formulaire A',
              },
              {
                icon: Flower2,
                color: '#fbbf24',
                bgColor: '#fffbeb',
                borderColor: '#fde68a',
                title: 'Vos volontés funéraires',
                desc: 'Vos préférences pour les arrangements funéraires, l\'avis de décès, la cérémonie. Évitez à votre famille de prendre ces décisions difficiles dans la douleur.',
                badge: 'Trousse complète',
                badgeBg: '#fef3c7',
                badgeColor: '#92400e',
                label: 'Formulaire B',
              },
              {
                icon: Lock,
                color: '#4c6ef5',
                bgColor: '#f0f4ff',
                borderColor: '#c7d2fe',
                title: 'Dossier complet du liquidateur',
                desc: 'Comptes bancaires, assurances, propriétés, mots de passe, testament. Le document le plus complet — à conserver dans un endroit sécurisé, jamais remis directement au liquidateur.',
                badge: 'Trousse complète',
                badgeBg: '#fef3c7',
                badgeColor: '#92400e',
                label: 'Formulaire C',
              },
              {
                icon: BookOpen,
                color: '#16a34a',
                bgColor: '#f0fdf4',
                borderColor: '#bbf7d0',
                title: 'Guide de mise en route',
                desc: 'Instructions claires pour utiliser chaque formulaire, registre de distribution des copies, conseils de sécurité et de mise à jour.',
                badge: 'Inclus dans les deux options',
                badgeBg: '#e3f2fd',
                badgeColor: '#1e3a8a',
                label: 'Guide d\'introduction',
              },
            ].map(({ icon: Icon, color, bgColor, borderColor, title, desc, badge, badgeBg, badgeColor, label }, i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                variants={fadeUp}
                style={{
                  backgroundColor: '#ffffff',
                  border: `1px solid ${borderColor}`,
                  borderRadius: '12px',
                  padding: '28px 24px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.07), 0 1px 2px rgba(0,0,0,0.04)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px',
                }}
              >
                <div style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '12px',
                  backgroundColor: bgColor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Icon size={26} style={{ color }} />
                </div>
                <div>
                  <p style={{ fontSize: '12px', fontWeight: 700, color, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>
                    {label}
                  </p>
                  <h3 style={{ fontSize: '19px', fontWeight: 700, color: '#1a365d', lineHeight: 1.3, margin: 0 }}>
                    {title}
                  </h3>
                </div>
                <p style={{ fontSize: '16px', color: '#64748b', lineHeight: 1.65, margin: 0, flex: 1 }}>
                  {desc}
                </p>
                <span style={{
                  display: 'inline-block',
                  backgroundColor: badgeBg,
                  color: badgeColor,
                  fontSize: '13px',
                  fontWeight: 600,
                  padding: '4px 12px',
                  borderRadius: '20px',
                  alignSelf: 'flex-start',
                }}>
                  {badge}
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
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            style={{ textAlign: 'center', marginBottom: '56px' }}
          >
            <p style={sectionLabelStyle}>Tarification simple et transparente</p>
            <h2 style={{
              fontSize: 'clamp(24px, 3.5vw, 36px)',
              fontWeight: 800,
              color: '#1a365d',
              lineHeight: 1.25,
            }}>
              Choisissez votre niveau de protection
            </h2>
          </motion.div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '24px',
            maxWidth: '800px',
            margin: '0 auto',
          }}>
            {/* Option Essentielle */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeLeft}
              style={{
                border: '2px solid #e2e8f0',
                borderRadius: '16px',
                padding: '36px 28px',
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
              }}
            >
              <div>
                <p style={{ fontSize: '14px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 8px' }}>
                  L'Essentiel
                </p>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                  <span style={{ fontSize: '44px', fontWeight: 800, color: '#1a365d', lineHeight: 1 }}>17 $</span>
                  <span style={{ fontSize: '15px', color: '#64748b' }}>paiement unique</span>
                </div>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  'Formulaire A (urgence)',
                  'Guide d\'introduction',
                  'Téléchargement PDF immédiat',
                  'À remplir à votre rythme',
                ].map(item => (
                  <li key={item} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '16px', color: '#1a365d' }}>
                    <CheckCircle2 size={18} style={{ color: '#16a34a', flexShrink: 0 }} />
                    {item}
                  </li>
                ))}
              </ul>
              <BtnSecondary href={DPD_FORM_A}>
                Commencer ma protection — 17 $
              </BtnSecondary>
            </motion.div>

            {/* Trousse Complète — RECOMMANDÉ */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeRight}
              style={{
                border: '2px solid #4c6ef5',
                borderRadius: '16px',
                padding: '36px 28px',
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
                position: 'relative',
                boxShadow: '0 10px 40px -8px rgba(76,110,245,0.25)',
              }}
            >
              {/* Badge RECOMMANDÉ */}
              <div style={{
                position: 'absolute',
                top: '-14px',
                left: '50%',
                transform: 'translateX(-50%)',
                backgroundColor: '#4c6ef5',
                color: '#ffffff',
                fontSize: '12px',
                fontWeight: 700,
                letterSpacing: '0.1em',
                padding: '5px 18px',
                borderRadius: '20px',
                whiteSpace: 'nowrap',
              }}>
                ★ RECOMMANDÉ
              </div>
              <div>
                <p style={{ fontSize: '14px', fontWeight: 700, color: '#4c6ef5', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 8px' }}>
                  Protection Complète
                </p>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                  <span style={{ fontSize: '44px', fontWeight: 800, color: '#1a365d', lineHeight: 1 }}>57 $</span>
                  <span style={{ fontSize: '15px', color: '#64748b' }}>paiement unique</span>
                </div>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  'Formulaire A (urgence)',
                  'Formulaire B (funérailles)',
                  'Formulaire C (liquidateur)',
                  'Guide d\'introduction',
                  'Téléchargement PDF immédiat',
                  'À remplir à votre rythme',
                ].map(item => (
                  <li key={item} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '16px', color: '#1a365d' }}>
                    <CheckCircle2 size={18} style={{ color: '#4c6ef5', flexShrink: 0 }} />
                    {item}
                  </li>
                ))}
              </ul>
              <BtnPrimary href={DPD_TROUSSE}>
                Protéger ma famille au complet — 57 $
              </BtnPrimary>
            </motion.div>
          </div>

          {/* Phrase d'ancrage */}
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            style={{
              textAlign: 'center',
              fontSize: '17px',
              color: '#64748b',
              fontStyle: 'italic',
              marginTop: '36px',
            }}
          >
            "Pour le prix d'un repas au restaurant, vous offrez à votre famille des années de sérénité."
          </motion.p>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          SECTION 5 — RÉASSURANCE
      ════════════════════════════════════════════════════ */}
      <section style={{ backgroundColor: '#f8fafc', padding: '80px 24px' }}>
        <div style={containerStyle}>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            style={{ textAlign: 'center', marginBottom: '56px' }}
          >
            <h2 style={{
              fontSize: 'clamp(22px, 3vw, 32px)',
              fontWeight: 800,
              color: '#1a365d',
              lineHeight: 1.25,
            }}>
              Ce que vous devez savoir avant d'acheter
            </h2>
          </motion.div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '24px',
          }}>
            {[
              {
                icon: Shield,
                color: '#4c6ef5',
                title: 'Vos informations restent chez vous',
                desc: 'Ces documents sont des PDF que vous remplissez et conservez vous-même. Aucune information n\'est transmise, stockée ou partagée en ligne.',
              },
              {
                icon: Scale,
                color: '#d97706',
                title: 'Conçu pour le Québec',
                desc: 'Les formulaires tiennent compte du Code civil du Québec, du mandat de protection, du rôle du liquidateur et des spécificités successorales québécoises.',
              },
              {
                icon: FileEdit,
                color: '#16a34a',
                title: 'À votre rythme',
                desc: 'Pas de délai, pas de pression. Remplissez les formulaires en plusieurs séances, mettez-les à jour quand votre situation change.',
              },
              {
                icon: CheckCircle2,
                color: '#FF6B35',
                title: 'Garantie de remboursement 30 jours',
                desc: 'Si vous n\'êtes pas satisfait pour quelque raison que ce soit, nous vous remboursons intégralement. Sans question.',
              },
            ].map(({ icon: Icon, color, title, desc }, i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                variants={fadeUp}
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '28px 24px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                }}
              >
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '10px',
                  backgroundColor: `${color}18`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '16px',
                }}>
                  <Icon size={24} style={{ color }} />
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#1a365d', marginBottom: '10px', lineHeight: 1.3 }}>
                  {title}
                </h3>
                <p style={{ fontSize: '16px', color: '#64748b', lineHeight: 1.65, margin: 0 }}>
                  {desc}
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
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            style={{ textAlign: 'center', marginBottom: '48px' }}
          >
            <h2 style={{
              fontSize: 'clamp(22px, 3vw, 32px)',
              fontWeight: 800,
              color: '#1a365d',
              lineHeight: 1.25,
            }}>
              Questions fréquentes
            </h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
          >
            <FaqItem
              question="La Trousse remplace-t-elle un testament ou un mandat de protection ?"
              answer="Non. La Trousse est complémentaire à ces documents juridiques. Elle organise et rassemble les informations essentielles pour que vos proches et votre liquidateur puissent agir rapidement et efficacement. Nous vous recommandons fortement d'avoir aussi un testament et un mandat de protection rédigés par un notaire."
            />
            <FaqItem
              question="Mes informations sont-elles en sécurité ?"
              answer="Absolument. Ces documents sont des PDF que vous téléchargez et conservez vous-même — sur votre ordinateur, dans un coffre-fort ou chez un notaire. Aucune information n'est jamais envoyée ni stockée en ligne."
            />
            <FaqItem
              question="Dois-je tout remplir en une seule fois ?"
              answer="Non. Les formulaires sont conçus pour être complétés progressivement. Commencez par les sections les plus urgentes, revenez y ajouter des informations au fil du temps."
            />
            <FaqItem
              question="Que se passe-t-il si ma situation change ?"
              answer="Vous mettez simplement votre document à jour. Le Formulaire A inclut un calendrier de mise à jour. Vous n'avez pas à racheter le produit."
            />
            <FaqItem
              question="Dois-je remettre le Formulaire C à mon liquidateur ?"
              answer="Non — et c'est intentionnel. Le Formulaire C contient vos informations les plus sensibles (comptes bancaires, mots de passe, accès). Conservez-le dans un endroit sécurisé (coffre-fort, coffret bancaire) et informez simplement votre liquidateur de son existence et de son emplacement. Il y accédera après votre décès."
            />
            <FaqItem
              question="En quoi est-ce différent d'un simple fichier Word que je ferais moi-même ?"
              answer="La Trousse a été structurée pour couvrir exhaustivement toutes les situations d'urgence et de succession au Québec — des dizaines de sections que vous n'auriez probablement pas pensé à inclure, avec un langage clair et des instructions pour chaque champ. C'est des heures de travail évitées et la certitude de n'avoir rien oublié."
            />
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          SECTION 7 — TRANSITION ABONNEMENT
      ════════════════════════════════════════════════════ */}
      <section style={{ backgroundColor: '#e3f2fd', padding: '72px 24px', borderTop: '1px solid #bfdbfe' }}>
        <div style={{ ...containerStyle, maxWidth: '760px', textAlign: 'center' }}>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <h2 style={{
              fontSize: 'clamp(22px, 3vw, 30px)',
              fontWeight: 800,
              color: '#1a365d',
              marginBottom: '20px',
              lineHeight: 1.3,
            }}>
              La Trousse est votre premier pas.
            </h2>
            <p style={{ fontSize: '18px', color: '#1e3a8a', lineHeight: 1.7, marginBottom: '32px' }}>
              Une fois votre famille protégée en cas d'imprévu, la prochaine étape est de planifier sereinement votre retraite : revenus, dépenses, investissements, REER, FERR, rentes.<br /><br />
              MonPlanRetraite.ca est la seule plateforme québécoise qui réunit tous ces outils dans un seul endroit — et vos informations restent toujours privées, stockées localement sur votre appareil.
            </p>
            <Link
              to="/"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                color: '#4c6ef5',
                fontWeight: 700,
                fontSize: '17px',
                textDecoration: 'none',
                padding: '14px 28px',
                border: '2px solid #4c6ef5',
                borderRadius: '8px',
                minHeight: '56px',
                transition: 'background-color 0.2s ease',
              }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f0f4ff')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              Découvrir la plateforme complète <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          SECTION 8 — CTA FINAL
      ════════════════════════════════════════════════════ */}
      <section style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1a2f5a 60%, #1e3a8a 100%)',
        padding: '88px 24px',
        textAlign: 'center',
      }}>
        <div style={containerStyle}>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <h2 style={{
              fontSize: 'clamp(26px, 4vw, 44px)',
              fontWeight: 800,
              color: '#ffffff',
              marginBottom: '16px',
              lineHeight: 1.2,
            }}>
              Votre famille mérite cette protection.
            </h2>
            <p style={{
              fontSize: '19px',
              color: 'rgba(255,255,255,0.65)',
              fontStyle: 'italic',
              marginBottom: '48px',
            }}>
              Quelques heures aujourd'hui. Une tranquillité d'esprit pour toute la vie.
            </p>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <BtnPrimary href={DPD_TROUSSE}>
                Protéger ma famille au complet — 57 $
              </BtnPrimary>
              <BtnSecondary href={DPD_FORM_A}>
                Commencer par l'essentiel — 17 $
              </BtnSecondary>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
