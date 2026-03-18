import React, { useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getAllPosts, getAvailableCategories, getCategoryDisplayLabel, BlogPost } from './utils/content';
import { useLanguage } from '@/features/retirement/hooks/useLanguage';
import Meta from '@/components/ui/Meta';

type Props = {
  language?: 'fr' | 'en';
};

function formatDateISOToHuman(iso: string, lang: 'fr' | 'en'): string {
  try {
    const d = new Date(iso + 'T00:00:00');
    return d.toLocaleDateString(lang === 'fr' ? 'fr-CA' : 'en-CA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return iso;
  }
}

function humanReadingTime(mins: number, lang: 'fr' | 'en'): string {
  if (lang === 'fr') return `${mins} min de lecture`;
  return `${mins} min read`;
}

/**
 * Simple category filter from query string (?cat=...).
 */
function useCategoryFilter(): string | undefined {
  const loc = useLocation();
  const params = new URLSearchParams(loc.search);
  return params.get('cat') || undefined;
}

/**
 * Simple tag filter from query string (?tag=...).
 */
function useTagFilter(): string | undefined {
  const loc = useLocation();
  const params = new URLSearchParams(loc.search);
  const tag = params.get('tag') || undefined;
  return tag;
}

const BlogIndex: React.FC<Props> = ({ language }) => {
  const { language: uiLanguage } = useLanguage();
  const location = useLocation();
  const pathLang: 'fr' | 'en' = location.pathname.startsWith('/en/') ? 'en' : 'fr';
  const lang: 'fr' | 'en' = language || pathLang || (uiLanguage === 'fr' ? 'fr' : 'en');
  const navigate = useNavigate();
  const selectedCategory = useCategoryFilter();
  const selectedTag = useTagFilter();

  const all = useMemo(() => getAllPosts(lang), [lang]);
  const categories = useMemo(() => getAvailableCategories(lang), [lang]);
  const posts = useMemo(() => {
    let list = all;
    if (selectedCategory && categories.includes(selectedCategory)) list = list.filter(p => p.category === selectedCategory);
    if (selectedTag) list = list.filter(p => p.tags.includes(selectedTag));
    return list;
  }, [all, categories, selectedCategory, selectedTag]);

  const onOpen = (p: BlogPost) => {
    navigate(`${lang === 'en' ? '/en/blog' : '/blog'}/${p.slug}`);
  };

  const title = lang === 'fr' ? 'Articles et guides retraite' : 'Retirement articles and guides';
  const subtitle = lang === 'fr'
    ? 'Des explications simples pour comprendre vos revenus, vos retraits, vos impôts et vos décisions de retraite'
    : 'Simple explanations to understand income, withdrawals, taxes, and retirement decisions';

  const categoryLabel = (cat: string) => getCategoryDisplayLabel(cat, lang);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Meta
        title={lang === 'fr' ? 'Articles et guides retraite | MonPlanRetraite.ca' : 'Retirement articles and guides | MonPlanRetraite.ca'}
        description={lang === 'fr'
          ? 'Parcourez nos articles simples sur la retraite au Québec pour mieux comprendre vos revenus, vos impôts et vos retraits.'
          : 'Browse simple retirement articles to better understand income, taxes, and withdrawals.'}
        lang={lang}
      />
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">{title}</h1>
            <p className="text-lg text-gray-600">{subtitle}</p>
            <p className="mt-3 text-base text-gray-500 max-w-3xl mx-auto">
              {lang === 'fr'
                ? 'Commencez par une question simple, puis passez à un outil ou à votre dossier quand vous êtes prêt.'
                : 'Start with one simple question, then move to a tool or your dossier when you are ready.'}
            </p>
            <div className="mt-5 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <button
                onClick={() => navigate(lang === 'fr' ? '/commencer' : '/start-here')}
                className="min-h-[48px] rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white"
              >
                {lang === 'fr' ? 'Commencer simplement' : 'Start simply'}
              </button>
              <button
                onClick={() => navigate(lang === 'fr' ? '/outils' : '/tools')}
                className="min-h-[48px] rounded-lg border border-blue-300 bg-white px-4 py-2 font-semibold text-blue-700"
              >
                {lang === 'fr' ? 'Voir les outils retraite' : 'See retirement tools'}
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="text-sm text-gray-700">{lang === 'fr' ? 'Catégories:' : 'Categories:'}</span>
            {categories.map(cat => {
              const active = selectedCategory === cat;
              const to = active ? (lang === 'en' ? '/en/blog' : '/blog') : `${lang === 'en' ? '/en/blog' : '/blog'}?cat=${encodeURIComponent(cat)}`;
              return (
                <button
                  key={cat}
                  onClick={() => navigate(to)}
                  className={`px-3 py-1 rounded-full text-sm border ${active ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'}`}
                  title={categoryLabel(cat)}
                >
                  {categoryLabel(cat)}
                </button>
              );
            })}
          </div>

          {/* List */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {posts.map(p => (
              <article
                key={p.id}
                className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col"
                onClick={() => onOpen(p)}
              >
                <div className="p-5 flex-1 flex flex-col">
                  <div className="text-xs text-blue-700 font-semibold mb-2">{categoryLabel(p.category)}</div>
                  <h2 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">{p.title}</h2>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">{p.excerpt}</p>
                  {p.keyPoints && p.keyPoints.length > 0 && (
                    <ul className="mb-4 list-disc list-inside text-sm text-gray-700 space-y-1">
                      {p.keyPoints.slice(0, 5).map((k, i) => <li key={i}>{k}</li>)}
                    </ul>
                  )}
                  <div className="mt-auto flex items-center justify-between text-xs text-gray-500">
                    <span>{formatDateISOToHuman(p.date, lang)}</span>
                    <span>{humanReadingTime(p.readingTime, lang)}</span>
                  </div>
                </div>
                <div className="px-5 pb-4">
                  <div className="flex flex-wrap gap-2">
                    {p.tags.map(t => (
                      <button
                        key={t}
                        onClick={(e) => { e.stopPropagation(); navigate(`${lang === 'en' ? '/en/blog' : '/blog'}?tag=${encodeURIComponent(t)}`); }}
                        className="px-2 py-0.5 text-xs rounded bg-gray-100 text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                        title={t}
                      >
                        #{t}
                      </button>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>

          {posts.length === 0 && (
            <div className="text-center text-gray-500 py-12">
              {lang === 'fr' ? 'Aucun article trouvé.' : 'No articles found.'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogIndex;
