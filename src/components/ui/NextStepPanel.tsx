import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, FolderOpen } from 'lucide-react';

interface NextStepPanelProps {
  title: string;
  text: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel?: string;
  secondaryHref?: string;
}

const NextStepPanel: React.FC<NextStepPanelProps> = ({
  title,
  text,
  primaryLabel,
  primaryHref,
  secondaryLabel,
  secondaryHref,
}) => {
  return (
    <div
      className="rounded-2xl border p-5 md:p-6"
      style={{ background: '#f8fafc', borderColor: 'var(--mpr-border)' }}
    >
      <div className="flex items-start gap-4">
        <div
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
          style={{ background: '#f0f4ff', color: 'var(--mpr-primary)' }}
        >
          <FolderOpen className="h-6 w-6" />
        </div>
        <div className="flex-1">
          <h3 className="mb-2">{title}</h3>
          <p className="text-[18px] leading-8 text-[color:var(--mpr-text)]">{text}</p>
          <div className="mt-4 flex flex-col sm:flex-row gap-3">
            <Link
              to={primaryHref}
              className="inline-flex min-h-[56px] items-center justify-center gap-2 rounded-xl px-5 text-[18px] font-semibold text-white"
              style={{ background: 'var(--mpr-primary)' }}
            >
              <span>{primaryLabel}</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
            {secondaryLabel && secondaryHref && (
              <Link
                to={secondaryHref}
                className="inline-flex min-h-[56px] items-center justify-center gap-2 rounded-xl border-2 px-5 text-[18px] font-semibold"
                style={{ borderColor: 'var(--mpr-primary)', color: 'var(--mpr-primary)', background: '#ffffff' }}
              >
                <span>{secondaryLabel}</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NextStepPanel;
