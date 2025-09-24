import React from 'react';
import { TOOLS_CATALOG } from '@/config/tools-catalog';
import { useLanguage } from '@/hooks/useLanguage';
import ToolCard from '@/components/ui/ToolCard';

export default function AllToolsPage() {
  const { isEnglish } = useLanguage();

  const free = TOOLS_CATALOG.filter(t => t.plan === 'free');
  const pro = TOOLS_CATALOG.filter(t => t.plan === 'professional');
  const expert = TOOLS_CATALOG.filter(t => t.plan === 'expert');

  return (
    <div className="senior-layout p-6">
      <h1 className="h1 mb-6">{isEnglish ? 'Tools' : 'Outils'}</h1>
      <p className="text-[18px] mb-6">
        {isEnglish
          ? 'Discover all available tools, grouped by plan. Large buttons, clear texts and accessible navigation are provided for comfortable use.'
          : 'Découvrez tous les outils disponibles, regroupés par forfait. Grands boutons, textes clairs et navigation accessible pour un usage confortable.'}
      </p>

      <section className="mb-8">
        <h2 className="h2 mb-3">{isEnglish ? 'Free' : 'Gratuit'}</h2>
        <div className="mpr-result-grid">
          {free.map(tool => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </section>

      <section className="mb-8">
        <h2 className="h2 mb-3">Pro</h2>
        <div className="mpr-result-grid">
          {pro.map(tool => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </section>

      <section className="mb-8">
        <h2 className="h2 mb-3">Expert</h2>
        <div className="mpr-result-grid">
          {expert.map(tool => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </section>
    </div>
  );
}
