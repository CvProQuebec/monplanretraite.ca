import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/features/retirement/hooks/useLanguage';
import {
  getAllPosts,
  getCategoryCounts,
  getFeaturedPosts,
  BLOG_CATEGORIES,
  slugifyCategory,
  type BlogPost,
} from './utils/content';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, BookOpen, Star, FolderOpen, Hammer, ArrowRight } from 'lucide-react';

const CategoryTile: React.FC<{
  label: string;
  count: number;
  onClick: () => void;
}> = ({ label, count, onClick }) => (
  <Card
    onClick={onClick}
    className="cursor-pointer hover:shadow-lg transition-shadow border-2 border-slate-200 bg-white"
    title={label}
  >
    <CardContent className="p-4">
      <div className="text-sm text-blue-700 font-semibold">{label}</div>
      <div className="text-xs text-slate-500">{count} articles</div>
    </CardContent>
  </Card>
);

function matchesQuery(p: BlogPost, q: string): boolean {
  const qq = q.trim().toLowerCase();
  if (!qq) return true;
  return (
    p.title.toLowerCase().includes(qq) ||
    p.excerpt.toLowerCase().includes(qq) ||
    (p.tags || []).some((t) => t.toLowerCase().includes(qq)) ||
    (p.keyPoints || []).some((kp) => kp.toLowerCase().includes(qq))
  );
}

const BlogHome: React.FC<{ language?: 'fr' | 'en' }> = ({ language }) => {
  const { language: uiLanguage } = useLanguage();
  const lang: 'fr' | 'en' = language || (uiLanguage === 'fr' ? 'fr' : 'en');
  const navigate = useNavigate();

  const [query, setQuery] = useState('');

  const featured = useMemo(() => getFeaturedPosts(lang), [lang]);
  const allPosts = useMemo(() => getAllPosts(lang), [lang]);
  const filtered = useMemo(() => allPosts.filter((p) => matchesQuery(p, query)), [allPosts, query]);
  const catCounts = useMemo(() => getCategoryCounts(lang), [lang]);

  const t = {
    title: lang === 'fr' ? 'Bibliothèque du Blog' : 'Blog Library',
    subtitle:
      lang === 'fr'
        ? '44 articles pour planifier votre retraite en confiance'
        : '44 articles to plan your retirement with confidence',
    searchPlaceholder: lang === 'fr' ? 'Rechercher un article, ex.: RRQ, CELI, budget…' : 'Search articles, e.g., OAS, TFSA, budget…',
    essentials: lang === 'fr' ? 'Guides essentiels' : 'Essential Guides',
    categories: lang === 'fr' ? 'Catégories' : 'Categories',
    tools: lang === 'fr' ? 'Outils & ressources' : 'Tools & Resources',
    viewAllCats: lang === 'fr' ? 'Voir toutes les catégories' : 'View all categories',
    viewEssentials: lang === 'fr' ? 'Voir les essentiels' : 'View essentials',
    viewTools: lang === 'fr' ? 'Voir les outils' : 'View tools',
    featuredPosts: lang === 'fr' ? 'À la une' : 'Featured',
    latestPosts: lang === 'fr' ? 'Derniers articles' : 'Latest Articles',
    noResults: lang === 'fr' ? 'Aucun article trouvé.' : 'No articles found.',
  };

  const openPost = (p: BlogPost) => navigate(`${lang === 'en' ? '/en/blog' : '/blog'}/${p.slug}`);
  const openCategory = (label: string) => navigate(`${lang === 'en' ? '/en/blog/category' : '/blog/categorie'}/${slugifyCategory(label)}`);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-6 py-10">
        {/* Hero */}
        <div className="max-w-6xl mx-auto text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 border border-blue-200 text-blue-800 text-sm">
            <BookOpen className="w-4 h-4" />
            <span>{lang === 'fr' ? 'Blog MonPlanRetraite.ca' : 'MonPlanRetraite.ca Blog'}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mt-4 mb-3">
            {t.title}
          </h1>
          <p className="text-lg md:text-xl text-gray-600">{t.subtitle}</p>

          {/* Quick links */}
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button
              onClick={() => navigate(lang === 'fr' ? '/blog/essentiels' : '/en/blog/essentials')}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Star className="w-4 h-4 mr-2" />
              {t.viewEssentials}
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate(lang === 'fr' ? '/blog/categories' : '/en/blog/categories')}
            >
              <FolderOpen className="w-4 h-4 mr-2" />
              {t.viewAllCats}
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate(lang === 'fr' ? '/blog/outils' : '/en/blog/tools')}
            >
              <Hammer className="w-4 h-4 mr-2" />
              {t.viewTools}
            </Button>
          </div>

          {/* Search */}
          <div className="mt-8 max-w-3xl mx-auto">
            <div className="flex items-center gap-2 bg-white border border-slate-300 rounded-xl p-2 shadow-sm">
              <Search className="w-5 h-5 text-slate-500" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="border-0 focus-visible:ring-0"
              />
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto space-y-10">
          {/* Categories tiles */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900">{t.categories}</h2>
              <Button
                variant="ghost"
                onClick={() => navigate(lang === 'fr' ? '/blog/categories' : '/en/blog/categories')}
              >
                {t.viewAllCats}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {catCounts.map(({ category, count }) => (
                <CategoryTile
                  key={category}
                  label={category}
                  count={count}
                  onClick={() => openCategory(category)}
                />
              ))}
            </div>
          </section>

          {/* Featured rail */}
          {featured.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{t.featuredPosts}</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {featured.slice(0, 6).map((p) => (
                  <Card
                    key={p.id}
                    className="cursor-pointer hover:shadow-md transition-shadow bg-white border-2 border-slate-200"
                    onClick={() => openPost(p)}
                  >
                    <CardHeader>
                      <CardTitle className="text-base line-clamp-2">{p.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-xs text-blue-700 font-semibold mb-2">{p.category}</div>
                      <p className="text-sm text-gray-600 line-clamp-3">{p.excerpt}</p>
                      <div className="mt-3 text-xs text-gray-500">
                        {new Date(p.date + 'T00:00:00').toLocaleDateString(
                          lang === 'fr' ? 'fr-CA' : 'en-CA',
                          { year: 'numeric', month: 'long', day: 'numeric' }
                        )}
                        {' · '}
                        {lang === 'fr' ? `${p.readingTime} min de lecture` : `${p.readingTime} min read`}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}

          {/* Search results or latest */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {query ? (lang === 'fr' ? 'Résultats de recherche' : 'Search results') : t.latestPosts}
            </h2>

            {filtered.length === 0 ? (
              <div className="text-center text-gray-500 py-12">{t.noResults}</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filtered.slice(0, 12).map((p) => (
                  <article
                    key={p.id}
                    className="bg-white rounded-xl border-2 border-slate-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col"
                    onClick={() => openPost(p)}
                  >
                    <div className="p-5 flex-1 flex flex-col">
                      <div className="text-xs text-blue-700 font-semibold mb-2">{p.category}</div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">{p.title}</h3>
                      <p className="text-sm text-gray-600 mb-4 line-clamp-3">{p.excerpt}</p>
                      <div className="mt-auto flex items-center justify-between text-xs text-gray-500">
                        <span>
                          {new Date(p.date + 'T00:00:00').toLocaleDateString(
                            lang === 'fr' ? 'fr-CA' : 'en-CA',
                            { year: 'numeric', month: 'long', day: 'numeric' }
                          )}
                        </span>
                        <span>{lang === 'fr' ? `${p.readingTime} min de lecture` : `${p.readingTime} min read`}</span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default BlogHome;
