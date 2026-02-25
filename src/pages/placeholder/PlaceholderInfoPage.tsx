import React from 'react';

type PlaceholderInfoPageProps = {
  title: string;
  description?: string;
  children?: React.ReactNode;
  tone?: 'blue' | 'green' | 'orange' | 'purple' | 'indigo' | 'cyan';
};

/**
 * PlaceholderInfoPage
 * Page générique d&#39;information marketing (statique), compacte et conforme aux styles seniors.
 * Objectif: remplacer les blocs <Route element={<div>...} /> ad hoc.
 */
export default function PlaceholderInfoPage({
  title,
  description,
  children,
  tone = 'blue'
}: PlaceholderInfoPageProps) {
  const toneMap: Record<NonNullable<PlaceholderInfoPageProps['tone']>, { bg: string; border: string; text: string }> = {
    blue: { bg: 'bg-mpr-interactive-lt', border: 'border-mpr-border', text: 'text-mpr-navy' },
    green: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-900' },
    orange: { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-900' },
    purple: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-900' },
    indigo: { bg: 'bg-mpr-interactive-lt', border: 'border-mpr-border', text: 'text-mpr-navy' },
    cyan: { bg: 'bg-cyan-50', border: 'border-cyan-200', text: 'text-cyan-900' }
  };

  const t = toneMap[tone];

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">{title}</h1>
        {description ? <p className="text-gray-600 mb-8">{description}</p> : null}
        <div className={`${t.bg} border ${t.border} rounded-lg p-6`}>
          <div className={`text-xl font-semibold ${t.text} mb-4`}>Information</div>
          <div className="space-y-3 text-gray-800 text-lg leading-7">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
