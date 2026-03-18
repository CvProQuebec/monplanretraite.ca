import React from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import type { ToolItem } from '@/config/tools-catalog';
import { useSubscriptionLimits } from '@/hooks/useSubscriptionLimits';
import { useFlags } from '@/hooks/useFlags';

type UserPlan = 'free' | 'professional' | 'expert';

function isLocked(toolPlan: UserPlan, userPlan: UserPlan): boolean {
  if (toolPlan === 'free') return false;
  if (toolPlan === 'professional') return userPlan === 'free';
  return userPlan !== 'expert';
}

export function ToolCard({ tool }: { tool: ToolItem }) {
  const { isEnglish } = useLanguage();
  const { ENABLE_ALL_TOOLS } = useFlags();
  const { currentPlan } = useSubscriptionLimits();
  const userPlan = (currentPlan as UserPlan) || 'free';
  const locked = ENABLE_ALL_TOOLS ? false : isLocked(tool.plan as UserPlan, userPlan);

  const title = isEnglish ? tool.titleEn : tool.titleFr;
  const desc = isEnglish ? tool.descEn : tool.descFr;
  const href = isEnglish ? tool.routeEn : tool.routeFr;

  const planClass =
    tool.plan === 'free' ? 'plan-free' : tool.plan === 'professional' ? 'plan-pro' : 'plan-expert';

  const planLabel =
    tool.plan === 'free'
      ? isEnglish
        ? 'Free'
        : 'Gratuit'
      : tool.plan === 'professional'
        ? isEnglish
          ? 'Professional'
          : 'Pro'
        : 'Expert';

  const cardLabel = `${title} - ${planLabel}`;
  const actionLabel = locked
    ? `${isEnglish ? 'Upgrade to access' : 'Mettre a niveau pour acceder a'} ${title}`
    : `${isEnglish ? 'Open this tool' : 'Ouvrir cet outil'} ${title}`;

  return (
    <article
      className={`mpr-result-card ${planClass}`}
      role="region"
      aria-label={cardLabel}
      tabIndex={0}
    >
      <div className="mb-2 flex items-center justify-between gap-2">
        <h3 className="h3 m-0 text-left">{title}</h3>
        <span className="badge shrink-0">{planLabel}</span>
      </div>

      <p className="text-left text-[16px] leading-7 text-[color:var(--mpr-text)]">{desc}</p>

      <p className="mt-2 text-left text-[14px] leading-6 text-[color:var(--mpr-text-muted)]">
        <strong>{isEnglish ? 'Useful for:' : 'Utile pour :'}</strong>{' '}
        {isEnglish
          ? 'understanding your situation and preparing a clearer discussion with your planner.'
          : 'mieux comprendre votre situation et preparer une discussion plus claire avec votre planificateur.'}
      </p>

      <div className="mt-4">
        {locked ? (
          <a
            className="senior-btn senior-btn-primary"
            href={isEnglish ? '/my-budget#plans' : '/mon-budget#plans'}
            aria-label={actionLabel}
          >
            {isEnglish ? 'Upgrade' : 'Mettre a niveau'}
          </a>
        ) : (
          <div className="flex items-start gap-2">
            <a className="senior-btn senior-btn-secondary" href={href} aria-label={actionLabel}>
              {isEnglish ? 'Open this tool' : 'Ouvrir cet outil'}
            </a>
            <a className="senior-btn senior-btn-primary" href={isEnglish ? '/my-dossier' : '/mon-dossier'}>
              {isEnglish ? 'Prepare my dossier' : 'Preparer mon dossier'}
            </a>
          </div>
        )}
      </div>

      {!locked && (
        <div className="mt-3">
          <a
            className="text-[16px] font-semibold text-[color:var(--mpr-primary)] underline underline-offset-2"
            href={isEnglish ? '/start-here' : '/commencer'}
          >
            {isEnglish ? 'Not sure where to start?' : 'Pas certain par ou commencer ?'}
          </a>
        </div>
      )}
    </article>
  );
}

export default ToolCard;
