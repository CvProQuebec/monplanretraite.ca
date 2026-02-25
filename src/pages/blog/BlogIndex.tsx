import React, { useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getAllPosts, BLOG_CATEGORIES, BlogPost } from './utils/content';
import { useLanguage } from '@/features/retirement/hooks/useLanguage';

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
  const cat = params.get('cat') || undefined;
  return cat && BLOG_CATEGORIES.includes(cat) ? cat : undefined;
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
  const posts = useMemo(() => {
    let list = all;
    if (selectedCategory) list = list.filter(p => p.category === selectedCategory);
    if (selectedTag) list = list.filter(p => p.tags.includes(selectedTag));
    return list;
  }, [all, selectedCategory, selectedTag]);

  const onOpen = (p: BlogPost) => {
    navigate(`${lang === 'en' ? '/en/blog' : '/blog'}/${p.slug}`);
  };

  const title = lang === 'fr' ? 'Blog MonPlanRetraite.ca' : 'MonPlanRetraite.ca Blog';
  const subtitle = lang === 'fr'
    ? 'Guides, conseils et analyses pour optimiser votre planification de retraite'
    : 'Guides, tips and analyses to optimize your retirement planning';

  // Localize category labels for display (keys remain FR for filtering)
  const categoryLabel = (cat: string) => {
    if (lang === 'fr') return cat;
    const map: Record<string, string> = {
      'Les bases de la retraite': 'Retirement basics',
      'Comprendre les régimes gouvernementaux': 'Government programs',
      'Gérer son épargne et ses placements': 'Manage savings and investments',
      'Planification pour les couples': 'Planning for couples',
      'Défis spécifiques aux femmes': 'Women-specific challenges',
      'Aspects pratiques et quotidiens': 'Practical everyday aspects',
      'Fiscalité simplifiée': 'Simple taxation',
      'Sujets saisonniers et d’actualité': 'Seasonal and current topics',
      'Outils et ressources': 'Tools and resources',
      'Bien-être et qualité de vie': 'Well-being and quality of life',
    };
    return map[cat] || cat;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-mpr-interactive-lt via-white to-purple-50">
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">{title}</h1>
            <p className="text-lg text-gray-600">{subtitle}</p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="text-sm text-gray-700">{lang === 'fr' ? 'Catégories:' : 'Categories:'}</span>
            {BLOG_CATEGORIES.map(cat => {
              const active = selectedCategory === cat;
              const to = active ? (lang === 'en' ? '/en/blog' : '/blog') : `${lang === 'en' ? '/en/blog' : '/blog'}?cat=${encodeURIComponent(cat)}`;
              return (
                <button
                  key={cat}
                  onClick={() => navigate(to)}
                  className={`px-3 py-1 rounded-full text-sm border ${active ? 'bg-mpr-interactive text-white border-mpr-interactive' : 'bg-white text-gray-700 border-gray-300 hover:border-mpr-interactive'}`}
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
                  <div className="text-xs text-mpr-navy font-semibold mb-2">{categoryLabel(p.category)}</div>
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
                        className="px-2 py-0.5 text-xs rounded bg-gray-100 text-gray-700 hover:bg-mpr-interactive-lt hover:text-mpr-navy"
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
