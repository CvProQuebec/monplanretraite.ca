import React, { useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '@/features/retirement/hooks/useLanguage';
import {
  getPostsByCategorySlug,
  resolveCategorySlug,
  slugifyCategory,
  type BlogPost,
} from './utils/content';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const CategoryPage: React.FC<{ language?: 'fr' | 'en' }> = ({ language }) => {
  const { slug } = useParams();
  const { language: uiLanguage } = useLanguage();
  const location = useLocation();
  const pathLang: 'fr' | 'en' = location.pathname.startsWith('/en/') ? 'en' : 'fr';
  const lang: 'fr' | 'en' = language || pathLang || (uiLanguage === 'fr' ? 'fr' : 'en');
  const navigate = useNavigate();

  const canonical = slug ? resolveCategorySlug(slug) : undefined;
  const posts = useMemo(() => (slug ? getPostsByCategorySlug(slug, lang) : []), [slug, lang]);

  // Localize category labels for display (keys remain FR for filtering)
  const categoryLabel = (cat: string | undefined) => {
    if (!cat) return undefined;
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
    back: lang === 'fr' ? 'Retour' : 'Back',
    title: canonical ? (lang === 'fr' ? canonical : categoryLabel(canonical)) : (lang === 'fr' ? 'Catégorie' : 'Category'),
    none: lang === 'fr' ? 'Aucun article dans cette catégorie.' : 'No articles in this category.',
    blog: lang === 'fr' ? '/blog' : '/en/blog',
  };

  const openPost = (p: BlogPost) => navigate(`${lang === 'en' ? '/en/blog' : '/blog'}/${p.slug}`);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">
              {t.title}
            </h1>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => navigate(t.blog)} className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                {t.back}
              </Button>
            </div>
          </div>

          {/* Posts */}
          {posts.length === 0 ? (
            <div className="text-center text-gray-500 py-12">{t.none}</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {posts.map((p) => (
                <Card
                  key={p.id}
                  className="cursor-pointer hover:shadow-md transition-shadow bg-white border-2 border-slate-200"
                  onClick={() => openPost(p)}
                  title={p.title}
                >
                  <CardHeader>
                    <div className="text-xs text-blue-700 font-semibold mb-1">{categoryLabel(p.category)}</div>
                    <CardTitle className="text-base line-clamp-2">{p.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
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
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
