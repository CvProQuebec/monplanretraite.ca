import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Compass } from 'lucide-react';

interface IntroLink {
  label: string;
  href: string;
}

interface GuidedPageIntroProps {
  eyebrow?: string;
  title: string;
  description: string;
  bullets: string[];
  primaryLink?: IntroLink;
  secondaryLink?: IntroLink;
}

const GuidedPageIntro: React.FC<GuidedPageIntroProps> = ({
  eyebrow,
  title,
  description,
  bullets,
  primaryLink,
  secondaryLink,
}) => {
  return (
    <div
      className="rounded-3xl border p-6 md:p-8"
      style={{
        background:
          'radial-gradient(circle at top left, rgba(76,110,245,0.12), transparent 34%), linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
        borderColor: 'var(--mpr-border)',
        boxShadow: '0 10px 15px -3px rgba(0,0,0,0.08), 0 4px 6px -2px rgba(0,0,0,0.05)',
      }}
    >
      {eyebrow && (
        <div
          className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-base font-semibold"
          style={{ background: '#e3f2fd', color: 'var(--mpr-h2)' }}
        >
          <Compass className="h-5 w-5" />
          <span>{eyebrow}</span>
        </div>
      )}

      <h2 className="mt-4 mb-3">{title}</h2>
      <p className="text-[18px] leading-8 text-[color:var(--mpr-text)] max-w-4xl">{description}</p>

      <div className="mt-5 grid gap-3 md:grid-cols-3">
        {bullets.map((bullet) => (
          <div
            key={bullet}
            className="flex items-start gap-3 rounded-2xl border bg-white px-4 py-4"
            style={{ borderColor: 'var(--mpr-border)' }}
          >
            <CheckCircle2 className="h-5 w-5 shrink-0 text-green-600 mt-1" />
            <p className="text-[16px] leading-7 text-[color:var(--mpr-text)]">{bullet}</p>
          </div>
        ))}
      </div>

      {(primaryLink || secondaryLink) && (
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          {primaryLink && (
            <Link
              to={primaryLink.href}
              className="inline-flex min-h-[56px] items-center justify-center gap-2 rounded-xl px-5 text-[18px] font-semibold text-white"
              style={{ background: 'var(--mpr-primary)' }}
            >
              <span>{primaryLink.label}</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          )}
          {secondaryLink && (
            <Link
              to={secondaryLink.href}
              className="inline-flex min-h-[56px] items-center justify-center gap-2 rounded-xl border-2 px-5 text-[18px] font-semibold"
              style={{ borderColor: 'var(--mpr-primary)', color: 'var(--mpr-primary)', background: '#ffffff' }}
            >
              <span>{secondaryLink.label}</span>
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default GuidedPageIntro;
