import React, { useMemo, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '@/features/retirement/hooks/useLanguage';
import {
  getAllPosts,
  getCategoryDisplayLabel,
  getCategoryCounts,
  getFeaturedPosts,
  slugifyCategory,
  type BlogPost,
} from './utils/content';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Meta from '@/components/ui/Meta';
import { ArrowRight, BookOpen, FolderOpen, Hammer, Search, Star } from 'lucide-react';
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
      <div className="text-base text-blue-700 font-semibold">{label}</div>
      <div className="text-sm text-slate-500">
        {count} {lang === 'fr' ? 'articles' : 'posts'}
      </div>
    </CardContent>
  </Card>
);

function matchesQuery(p: BlogPost, q: string): boolean {
  const raw = q.trim();
  if (!raw) return true;

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

  const tokens = norm(raw).split(/\s+/).filter(Boolean);

  return tokens.every((token) => haystack.includes(token));
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
  const filtered = useMemo(() => allPosts.filter((p) => matchesQuery(p, query)), [allPosts, query]);
  const catCounts = useMemo(() => getCategoryCounts(lang), [lang]);

  const categoryLabel = (cat: string) => getCategoryDisplayLabel(cat, lang);
  const openPost = (p: BlogPost) => navigate(`${lang === 'en' ? '/en/blog' : '/blog'}/${p.slug}`);
  const openCategory = (label: string) =>
    navigate(`${lang === 'en' ? '/en/blog/category' : '/blog/categorie'}/${slugifyCategory(label)}`);

  const guidedPaths = [
    {
      icon: BookOpen,
      title: lang === 'fr' ? 'Je veux comprendre avant de calculer' : 'I want to understand before calculating',
      text:
        lang === 'fr'
          ? 'Commencez avec les guides de base si vous voulez y voir clair avant d’utiliser un outil.'
          : 'Start with the basics if you want clarity before using a calculator.',
      action: lang === 'fr' ? 'Voir les guides de base' : 'See basic guides',
      onClick: () => openCategory('Les bases de la retraite'),
    },
    {
      icon: Hammer,
      title: lang === 'fr' ? 'Je veux passer à l’action' : 'I want to take action',
      text:
        lang === 'fr'
          ? 'Passez directement à nos outils si vous voulez évaluer votre situation.'
          : 'Go straight to our tools if you want to assess your situation.',
      action: lang === 'fr' ? 'Voir les outils' : 'See tools',
      onClick: () => navigate(lang === 'fr' ? '/outils' : '/tools'),
    },
    {
      icon: FolderOpen,
      title: lang === 'fr' ? 'Je veux préparer mon dossier' : 'I want to prepare my dossier',
      text:
        lang === 'fr'
          ? 'Regroupez vos chiffres, vos décisions et vos rapports pour un rendez-vous utile.'
          : 'Gather your numbers, decisions and reports for a useful meeting.',
      action: lang === 'fr' ? 'Préparer mon dossier' : 'Prepare my dossier',
      onClick: () => navigate(lang === 'fr' ? '/mon-dossier' : '/my-dossier'),
    },
  ];

  const situations = [
    {
      title: lang === 'fr' ? 'Je suis à 5 ans de la retraite' : 'I am within 5 years of retirement',
      onClick: () => navigate(lang === 'fr' ? '/mon-dossier' : '/my-dossier'),
    },
    {
      title: lang === 'fr' ? 'Je veux savoir quand demander la RRQ ou la SV' : 'I want to know when to start QPP or OAS',
      onClick: () => navigate(lang === 'fr' ? '/outils#revenus' : '/tools#revenus'),
    },
    {
      title: lang === 'fr' ? 'Je veux payer moins d’impôt' : 'I want to pay less tax',
      onClick: () => navigate(lang === 'fr' ? '/outils#impots' : '/tools#impots'),
    },
    {
      title: lang === 'fr' ? 'Je suis travailleur autonome' : 'I am self-employed',
      onClick: () => navigate(lang === 'fr' ? '/outils#situations' : '/tools#situations'),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50">
      <Meta
        title={
          lang === 'fr'
            ? 'Articles et guides retraite au Québec | MonPlanRetraite.ca'
            : 'Retirement articles and guides | MonPlanRetraite.ca'
        }
        description={
          lang === 'fr'
            ? 'Articles simples sur la retraite au Québec pour comprendre la RRQ, la SV, le FERR, l’impôt et mieux préparer votre dossier.'
            : 'Simple retirement articles to understand QPP, OAS, RRIFs, taxes, and prepare a clearer retirement dossier.'
        }
        lang={lang}
      />

      <div className="container mx-auto px-6 py-10">
        <div className="max-w-6xl mx-auto space-y-10">
          <section className="rounded-3xl border-2 border-blue-100 bg-white p-6 md:p-10 shadow-sm">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-800 text-base font-semibold">
              <BookOpen className="w-5 h-5" />
              <span>{lang === 'fr' ? 'Guides MonPlanRetraite.ca' : 'MonPlanRetraite.ca Guides'}</span>
            </div>
            <h1 className="mt-5 mb-4 text-4xl font-bold text-slate-900">
              {lang === 'fr'
                ? 'Des articles simples pour mieux comprendre la retraite au Québec'
                : 'Simple articles to better understand retirement'}
            </h1>
            <p className="max-w-3xl text-[18px] leading-8 text-slate-700">
              {lang === 'fr'
                ? `${allPosts.length} articles pour vous aider à comprendre, à agir et à préparer un dossier utile pour votre planificateur financier.`
                : `${allPosts.length} articles to help you understand, act, and prepare a useful dossier for your planner.`}
            </p>
            <p className="mt-4 max-w-3xl text-[16px] leading-7 text-slate-600">
              {lang === 'fr'
                ? 'Commencez par une question simple, puis passez à l’outil associé quand vous êtes prêt.'
                : 'Start with one simple question, then move to the related tool when you are ready.'}
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-4">
              <Button onClick={() => navigate(lang === 'fr' ? '/commencer' : '/start-here')} className="min-h-[56px] text-base font-semibold">
                {lang === 'fr' ? 'Commencer simplement' : 'Start simply'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button variant="outline" onClick={() => navigate(lang === 'fr' ? '/outils' : '/tools')} className="min-h-[56px] text-base font-semibold">
                {lang === 'fr' ? 'Voir les outils associés' : 'See related tools'}
              </Button>
            </div>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {guidedPaths.map((path) => {
              const Icon = path.icon;
              return (
                <Card
                  key={path.title}
                  onClick={path.onClick}
                  className="cursor-pointer hover:shadow-lg transition-shadow border-2 border-slate-200 bg-white"
                >
                  <CardContent className="p-5">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-700 mb-4">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">{path.title}</h2>
                    <p className="text-[18px] text-gray-700 leading-8 mb-4">{path.text}</p>
                    <div className="inline-flex items-center gap-2 text-base font-semibold text-blue-700">
                      <span>{path.action}</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </section>

          <section className="rounded-2xl border-2 border-orange-200 bg-orange-50 p-5">
            <div className="flex items-start gap-3 mb-4">
              <Star className="w-6 h-6 text-orange-600 mt-0.5" />
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {lang === 'fr' ? 'Commencer selon votre situation' : 'Start with your situation'}
                </h2>
                <p className="text-[18px] text-gray-700 leading-8 mt-1">
                  {lang === 'fr'
                    ? 'Choisissez la situation qui ressemble le plus à la vôtre pour éviter de vous perdre.'
                    : 'Choose the situation that looks most like yours so you do not get lost.'}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {situations.map((item) => (
                <button
                  key={item.title}
                  onClick={item.onClick}
                  className="min-h-[56px] rounded-xl bg-white px-4 py-3 text-left text-[18px] font-semibold text-gray-800 border border-orange-200 hover:border-orange-300 hover:bg-orange-100 transition-colors"
                >
                  {item.title}
                </button>
              ))}
            </div>
          </section>

          <section>
            <div className="flex items-center gap-2 bg-white border border-slate-300 rounded-xl p-3 shadow-sm">
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
                placeholder={
                  lang === 'fr'
                    ? 'Rechercher un article, ex.: RRQ, CELI, budget'
                    : 'Search an article, e.g. QPP, TFSA, budget'
                }
                className="border-0 focus-visible:ring-0 text-[18px]"
              />
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {lang === 'fr' ? 'Catégories' : 'Categories'}
            </h2>
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

          {featured.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {lang === 'fr' ? 'À la une' : 'Featured'}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {featured.slice(0, 6).map((post) => (
                  <Card
                    key={post.id}
                    className="cursor-pointer hover:shadow-md transition-shadow bg-white border-2 border-slate-200"
                    onClick={() => openPost(post)}
                  >
                    <CardHeader>
                      <CardTitle className="text-lg leading-7 line-clamp-2">{post.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm text-blue-700 font-semibold mb-2">{categoryLabel(post.category)}</div>
                      <p className="text-[16px] text-gray-600 leading-7 line-clamp-3">{post.excerpt}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}

          <section ref={resultsRef}>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {query
                ? lang === 'fr'
                  ? 'Résultats de recherche'
                  : 'Search results'
                : lang === 'fr'
                  ? 'Derniers articles'
                  : 'Latest articles'}
            </h2>

            {filtered.length === 0 ? (
              <div className="text-center text-gray-500 py-12">
                {lang === 'fr' ? 'Aucun article trouvé.' : 'No articles found.'}
              </div>
            ) : (
              <div className="blog-grid">
                {(showAll ? filtered : filtered.slice(0, 12)).map((post) => (
                  <article
                    key={post.id}
                    className="article-card"
                    onClick={() => openPost(post)}
                    role="button"
                    tabIndex={0}
                  >
                    <div className="article-card-header">
                      {post.featured && (
                        <span className="article-badge">{lang === 'fr' ? 'Populaire' : 'Popular'}</span>
                      )}
                      <h3 className="article-title">{post.title}</h3>
                    </div>
                    <div className="article-preview">
                      <p>{post.excerpt}</p>
                    </div>
                    <div className="article-actions">
                      <button className="btn-read-more" onClick={(e) => { e.stopPropagation(); openPost(post); }}>
                        {lang === 'fr' ? "Lire l'article" : 'Read article'}
                      </button>
                      <div className="article-engagement">
                        <span>{categoryLabel(post.category)}</span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}

            {filtered.length > 12 && (
              <div className="mt-6 flex justify-center">
                <Button variant="outline" onClick={() => setShowAll((value) => !value)}>
                  {showAll
                    ? lang === 'fr'
                      ? 'Afficher moins'
                      : 'Show less'
                    : lang === 'fr'
                      ? `Voir les ${filtered.length} articles`
                      : `View all ${filtered.length} articles`}
                </Button>
              </div>
            )}
          </section>

          <section>
            <Card className="border-2 border-blue-200 bg-blue-50">
              <CardContent className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
                  <div className="max-w-3xl">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      {lang === 'fr'
                        ? 'Après vos lectures, préparez votre dossier'
                        : 'After reading, prepare your dossier'}
                    </h2>
                    <p className="text-[18px] text-gray-700 leading-8">
                      {lang === 'fr'
                        ? 'Quand un article répond à votre question, l’étape suivante consiste à regrouper vos chiffres, vos décisions et vos rapports pour votre rendez-vous.'
                        : 'Once an article answers your question, the next step is to gather your numbers, decisions and reports for your meeting.'}
                    </p>
                  </div>
                  <Button
                    onClick={() => navigate(lang === 'fr' ? '/mon-dossier' : '/my-dossier')}
                    className="min-h-[56px] text-base font-semibold"
                  >
                    {lang === 'fr' ? 'Préparer mon dossier' : 'Prepare my dossier'}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
};

export default BlogHome;
