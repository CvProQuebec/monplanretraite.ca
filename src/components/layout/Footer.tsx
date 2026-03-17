import React from 'react';
import { Mail } from 'lucide-react';
import { useLanguage } from '../../features/retirement/hooks/useLanguage';

const CONTACT_EMAIL = 'gerald.dore@gmail.com';

const Footer: React.FC = () => {
  const { isFr } = useLanguage();

  return (
    <footer
      style={{
        backgroundColor: '#0f172a',
        borderTop: '1px solid rgba(255,255,255,0.08)',
        padding: '32px 24px',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
        }}
      >
        {/* Copyright */}
        <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.45)', margin: 0 }}>
          © {new Date().getFullYear()} MonPlanRetraite.ca —{' '}
          {isFr ? 'Tous droits réservés.' : 'All rights reserved.'}
        </p>

        {/* Contact */}
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            color: 'rgba(255,255,255,0.65)',
            textDecoration: 'none',
            fontSize: '15px',
            fontWeight: 500,
            padding: '8px 16px',
            borderRadius: '8px',
            border: '1px solid rgba(255,255,255,0.12)',
            minHeight: '40px',
            transition: 'color 0.2s ease, border-color 0.2s ease, background-color 0.2s ease',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.color = '#ffffff';
            (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.3)';
            (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(255,255,255,0.06)';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.65)';
            (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.12)';
            (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
          }}
        >
          <Mail size={16} aria-hidden="true" />
          {isFr ? 'Questions ? ' : 'Questions? '}
          <span style={{ color: '#93c5fd', textDecoration: 'underline', textDecorationColor: 'rgba(147,197,253,0.4)' }}>
            {CONTACT_EMAIL}
          </span>
        </a>
      </div>
    </footer>
  );
};

export default Footer;
