import React, { useMemo, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
import './blog.css';

const CategoryTile: React.FC<{
  label: string;
  count: number;
  onClick: () => void;
  lang: 'fr' | 'en';
}> = ({ label, count, onClick, lang }) => (
  <Card
    onClick={onClick}
    className="cursor-pointer hover:shadow-lg transition-shadow border-2 border-slate-200 bg-white"
    title={label}
  >
    <CardContent className="p-4">
      <div className="text-sm text-mpr-navy font-semibold">{label}</div>
      <div className="text-xs text-slate-500">{count} {lang === 'fr' ? 'articles' : 'posts'}</div>
    </CardContent>
  </Card>
);

function matchesQuery(p: BlogPost, q: string): boolean {
  const raw = q.trim();
  if (!raw) return true;

  // Normalize: lowercase + strip diacritics
  const norm = (s: string) =>
    (s || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

  const haystack = [
    p.title,
    p.excerpt,
    p.category,
    p.slug,
    ...(p.tags || []),
    ...(p.keyPoints || []),
    p.content,
  ]
    .map(norm)
    .join(' ');

  // Tokenize query and expand synonyms/aliases (FR/EN)
  const tokens = norm(raw)
    .split(/\s+/)
    .filter(Boolean);

  const expandToken = (t: string): string[] => {
    const map: Record<string, string[]> = {
      // Government programs
      oas: ['oas', 'old age security', 'sv', 'securite vieillesse', 'securite de la vieillesse'],
      sv: ['sv', 'securite vieillesse', 'securite de la vieillesse', 'oas', 'old age security'],
      cpp: ['cpp', 'rpc', 'rrq', 'qpp'],
      qpp: ['qpp', 'rrq', 'cpp', 'rpc'],
      rrq: ['rrq', 'qpp', 'cpp', 'rpc'],
      rpc: ['rpc', 'cpp', 'rrq', 'qpp'],

      // Accounts
      tfsa: ['tfsa', 'celi'],
      celi: ['celi', 'tfsa'],
      rrsp: ['rrsp', 'reer'],
      reer: ['reer', 'rrsp'],

      // Tax
      tax: ['tax', 'impot', 'impots', 'fiscalite', 'fiscalité'],
      impot: ['impot', 'impots', 'tax', 'fiscalite', 'fiscalité'],
      impots: ['impots', 'impot', 'tax', 'fiscalite', 'fiscalité'],
      fiscalite: ['fiscalite', 'fiscalité', 'tax', 'impot', 'impots'],
      fiscalité: ['fiscalite', 'fiscalité', 'tax', 'impot', 'impots'],

      // Budget/money
      budget: ['budget', 'expenses', 'depenses', 'dépenses'],
      depenses: ['depenses', 'dépenses', 'expenses', 'budget'],
      'dépenses': ['depenses', 'dépenses', 'expenses', 'budget'],

      // Widely used words (retirement)
      retraite: ['retraite', 'retirement'],
      retirement: ['retirement', 'retraite'],
    };
    return map[t] ? map[t] : [t];
  };

  // For each token, at least one synonym must be contained in content
  return tokens.every((t) => {
    const variants = expandToken(t);
    return variants.some((v) => haystack.includes(v));
  });
}

function getTabForPost(categoryFR: string, tagsLower: string[]): 'planning' | 'money' | 'lifestyle' {
  const c = (categoryFR || '').toLowerCase();
  const includesAny = (arr: string[]) => arr.some((s) => c.includes(s));
  // Map canonical FR categories to tabs
  if (includesAny([
    'les bases de la retraite',
    'planification pour les couples',
    'outils et ressources',
  ])) return 'planning';

  if (includesAny([
    'comprendre les régimes gouvernementaux',
    'gérer son épargne et ses placements',
    'fiscalité simplifiée',
    'sujets saisonniers et d’actualité',
    "sujets saisonniers et d'actualité",
  ])) return 'money';

  if (includesAny([
    'aspects pratiques et quotidiens',
    'bien-être et qualité de vie',
    'défis spécifiques aux femmes',
  ])) return 'lifestyle';

  // Fallbacks using tags if category doesn't match
  if (tagsLower.some((t) =>
    ['budget','fiscalité','rrq','cpp','oas','sv','srg','reer','rrsp','celi','tfsa','tax'].includes(t)
  )) return 'money';

  if (tagsLower.some((t) =>
    ['sante','santé','bien-être','lifestyle','quality of life','practical','health'].some(k => t.includes(k))
  )) return 'lifestyle';

  return 'planning';
}

const BlogHome: React.FC<{ language?: 'fr' | 'en' }> = ({ language }) => {
  const { language: uiLanguage } = useLanguage();
  const location = useLocation();
  const pathLang: 'fr' | 'en' = location.pathname.startsWith('/en/') ? 'en' : 'fr';
  const lang: 'fr' | 'en' = language || pathLang || (uiLanguage === 'fr' ? 'fr' : 'en');
  const navigate = useNavigate();

  const [query, setQuery] = useState('');
  const [showAll, setShowAll] = useState(false);
  const resultsRef = useRef<HTMLDivElement | null>(null);

  const featured = useMemo(() => getFeaturedPosts(lang), [lang]);
  const allPosts = useMemo(() => getAllPosts(lang), [lang]);
  const filtered = useMemo(() => {
    return allPosts.filter((p) => matchesQuery(p, query));
  }, [allPosts, query]);
  const catCounts = useMemo(() => getCategoryCounts(lang), [lang]);

  // Localize category labels for display (keys remain FR for filtering and slugs)
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
    <div className="min-h-screen bg-gradient-to-br from-mpr-interactive-lt via-white to-purple-50">
      <div className="container mx-auto px-6 py-10">
        {/* Hero amélioré */}
        <div className="max-w-6xl mx-auto">
          <div className="blog-hero">
            <div className="hero-content">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-mpr-interactive-lt border border-mpr-border text-mpr-navy text-sm">
                <BookOpen className="w-4 h-4" />
                <span>{lang === 'fr' ? 'Blog MonPlanRetraite.ca' : 'MonPlanRetraite.ca Blog'}</span>
              </div>
              <h1>{lang === 'fr' ? 'Votre guide complet vers une retraite sereine' : 'Your complete guide to a confident retirement'}</h1>
              <p className="hero-subtitle">
                {lang === 'fr'
                  ? 'Des conseils pratiques, des outils simples et des réponses claires pour préparer votre avenir financier'
                  : 'Practical advice, simple tools and clear answers to prepare your financial future'}
              </p>
              <div className="hero-stats">
                <div className="stat-item">
                  <span className="stat-number">15,000+</span>
                  <span className="stat-label">{lang === 'fr' ? 'Québécois aidés' : 'Quebecers helped'}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">95%</span>
                  <span className="stat-label">{lang === 'fr' ? 'Satisfaction' : 'Satisfaction'}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">{allPosts.length}+</span>
                  <span className="stat-label">{lang === 'fr' ? 'Articles experts' : 'Expert articles'}</span>
                </div>
              </div>
              <button className="cta-button" onClick={() => navigate(lang === 'fr' ? '/wizard/profil' : '/wizard/profil')}>
                {lang === 'fr' ? 'Commencer ma planification gratuite' : 'Start my free planning'}
              </button>
            </div>
          </div>

          {/* Search only */}
          <div className="mb-6">
            <div className="flex items-center gap-2 bg-white border border-slate-300 rounded-xl p-2 shadow-sm">
              <Search className="w-5 h-5 text-slate-500" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    setShowAll(true);
                    setTimeout(() => {
                      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }, 0);
                  }
                }}
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
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {catCounts.map(({ category, count }) => (
                <CategoryTile
                  key={category}
                  label={lang === 'fr' ? category : categoryLabel(category)}
                  count={count}
                  onClick={() => openCategory(category)}
                  lang={lang}
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
                      <div className="text-xs text-mpr-navy font-semibold mb-2">{categoryLabel(p.category)}</div>
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

          {/* Grille d'articles modernisée */}
          <section className="mt-6" ref={resultsRef}>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {query ? (lang === 'fr' ? 'Résultats de recherche' : 'Search results') : t.latestPosts}
            </h2>
            {filtered.length === 0 ? (
              <div className="text-center text-gray-500 py-12">{t.noResults}</div>
            ) : (
              <div className="blog-grid">
                {(showAll ? filtered : filtered.slice(0, 12)).map((p) => {
                  const reading = lang === 'fr' ? `${p.readingTime} min de lecture` : `${p.readingTime} min read`;
                  const difficulty =
                    p.readingTime <= 5 ? (lang === 'fr' ? 'Débutant' : 'Beginner')
                    : p.readingTime <= 10 ? (lang === 'fr' ? 'Intermédiaire' : 'Intermediate')
                    : (lang === 'fr' ? 'Avancé' : 'Advanced');
                  const icon = (() => {
                    const c = (p.category || '').toLowerCase();
                    if (c.includes('fiscal') || c.includes('impôt')) return '🧮';
                    if (c.includes('gouvernement')) return '🏛️';
                    if (c.includes('outils') || c.includes('ressources')) return '🛠️';
                    if (c.includes('bases') || c.includes('retraite')) return '📘';
                    if (c.includes('bien-être') || c.includes('qualité')) return '🌿';
                    return '📄';
                  })();

                  return (
                    <article key={p.id} className="article-card" onClick={() => openPost(p)} role="button" tabIndex={0}>
                      <div className="article-card-header">
                        <div className="article-icon">{icon}</div>
                        {p.featured && (
                          <span className="article-badge">{lang === 'fr' ? 'Populaire' : 'Popular'}</span>
                        )}
                        <h3 className="article-title">{p.title}</h3>
                        <div className="article-meta">
                          <span className="reading-time">⏱ {reading}</span>
                          <span className="difficulty-level">🎓 {difficulty}</span>
                        </div>
                      </div>
                      <div className="article-preview">
                        <p>{p.excerpt}</p>
                        {p.keyPoints && p.keyPoints.length > 0 && (
                          <div className="article-highlights">
                            {p.keyPoints.slice(0, 3).map((kp, idx) => (
                              <span key={idx} className="highlight-point">✓ {kp}</span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="article-actions">
                        <button className="btn-read-more" onClick={(e) => { e.stopPropagation(); openPost(p); }}>
                          {lang === 'fr' ? "Lire l'article" : 'Read article'}
                        </button>
                        <div className="article-engagement">
                          <span>{categoryLabel(p.category)}</span>
                          <span>
                            {new Date(p.date + 'T00:00:00').toLocaleDateString(
                              lang === 'fr' ? 'fr-CA' : 'en-CA',
                              { year: 'numeric', month: 'long', day: 'numeric' }
                            )}
                          </span>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
            {filtered.length > 12 && (
              <div className="mt-6 flex justify-center">
                <Button variant="outline" onClick={() => setShowAll((v) => !v)}>
                  {showAll
                    ? (lang === 'fr' ? 'Afficher moins' : 'Show less')
                    : (lang === 'fr' ? `Voir tous les ${filtered.length} articles` : `View all ${filtered.length} articles`)}
                </Button>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default BlogHome;
