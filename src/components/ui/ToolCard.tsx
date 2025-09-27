import React from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import type { ToolItem } from '@/config/tools-catalog';
import { useSubscriptionLimits } from '@/hooks/useSubscriptionLimits';
import { useFlags } from '@/hooks/useFlags';

type UserPlan = 'free' | 'professional' | 'expert';

function isLocked(toolPlan: UserPlan, userPlan: UserPlan): boolean {
  if (toolPlan === 'free') return false;
  if (toolPlan === 'professional') return userPlan === 'free';
  // expert
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
    tool.plan === 'free' ? (isEnglish ? 'Free' : 'Gratuit')
      : tool.plan === 'professional' ? (isEnglish ? 'Professional' : 'Pro')
      : 'Expert';

  return (
    <div className={`mpr-result-card ${planClass}`} role="region" aria-label={title} tabIndex={0}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="h3 m-0">{title}</h3>
        <span className="badge">{planLabel}</span>
      </div>
      <p className="text-[16px] leading-6 text-[color:var(--mpr-text)]">{desc}</p>
      <div className="mt-3">
        {locked ? (
          <a className="senior-btn senior-btn-primary" href={isEnglish ? '/my-budget#plans' : '/mon-budget#plans'}>
            {isEnglish ? 'Upgrade' : 'Mettre à niveau'}
          </a>
        ) : (
          <a className="senior-btn senior-btn-secondary" href={href}>
            {isEnglish ? 'Open tool' : 'Ouvrir l’outil'}
          </a>
        )}
      </div>
    </div>
  );
}

export default ToolCard;
