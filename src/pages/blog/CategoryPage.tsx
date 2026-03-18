import React, { useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '@/features/retirement/hooks/useLanguage';
import {
  getCategoryDescription,
  getCategoryDisplayLabel,
  getPostsByCategorySlug,
  resolveCategorySlug,
  type BlogPost,
} from './utils/content';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Meta from '@/components/ui/Meta';
import NextStepPanel from '@/components/ui/NextStepPanel';
import { ArrowLeft } from 'lucide-react';

const CategoryPage: React.FC<{ language?: 'fr' | 'en' }> = ({ language }) => {
  const { slug } = useParams();
  const { language: uiLanguage } = useLanguage();
  const location = useLocation();
  const pathLang: 'fr' | 'en' = location.pathname.startsWith('/en/') ? 'en' : 'fr';
  const lang: 'fr' | 'en' = language || pathLang || (uiLanguage === 'fr' ? 'fr' : 'en');
  const navigate = useNavigate();

  const canonical = slug ? resolveCategorySlug(slug, lang) : undefined;
  const posts = useMemo(() => (slug ? getPostsByCategorySlug(slug, lang) : []), [slug, lang]);

  const categoryLabel = (cat: string | undefined) => (cat ? getCategoryDisplayLabel(cat, lang) : undefined);
  const categoryDescription = canonical
    ? getCategoryDescription(canonical, lang)
    : lang === 'fr'
      ? 'Parcourez les articles de cette categorie pour mieux comprendre votre retraite.'
      : 'Browse the articles in this category to better understand retirement.';

  const t = {
    back: lang === 'fr' ? 'Retour' : 'Back',
    title: canonical
      ? lang === 'fr'
        ? canonical
        : categoryLabel(canonical)
      : lang === 'fr'
        ? 'Categorie'
        : 'Category',
    none: lang === 'fr' ? 'Aucun article dans cette categorie.' : 'No articles in this category.',
    blog: lang === 'fr' ? '/blog' : '/en/blog',
  };

  const openPost = (p: BlogPost) => navigate(`${lang === 'en' ? '/en/blog' : '/blog'}/${p.slug}`);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Meta title={`${t.title} | MonPlanRetraite.ca`} description={categoryDescription} lang={lang} />
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">{t.title}</h1>
              <p className="mt-2 max-w-3xl text-[18px] leading-8 text-gray-600">{categoryDescription}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => navigate(t.blog)} className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                {t.back}
              </Button>
            </div>
          </div>

          {posts.length === 0 ? (
            <div className="py-12 text-center text-gray-500">{t.none}</div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                {posts.map((p) => (
                  <Card
                    key={p.id}
                    className="cursor-pointer border-2 border-slate-200 bg-white transition-shadow hover:shadow-md"
                    onClick={() => openPost(p)}
                    title={p.title}
                  >
                    <CardHeader>
                      <div className="mb-1 text-xs font-semibold text-blue-700">{categoryLabel(p.category)}</div>
                      <CardTitle className="line-clamp-2 text-base">{p.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="line-clamp-3 text-sm text-gray-600">{p.excerpt}</p>
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

              <div className="mt-8">
                <NextStepPanel
                  title={lang === 'fr' ? 'Choisir votre prochaine etape' : 'Choose your next step'}
                  text={
                    lang === 'fr'
                      ? 'Quand cette categorie vous aide a mieux comprendre un sujet, passez ensuite a un outil simple ou commencez votre dossier retraite.'
                      : 'Once this category helps you better understand a topic, move next to a simple tool or start your retirement dossier.'
                  }
                  primaryLabel={lang === 'fr' ? 'Voir mes outils retraite' : 'See my retirement tools'}
                  primaryHref={lang === 'fr' ? '/outils' : '/tools'}
                  secondaryLabel={lang === 'fr' ? 'Preparer mon dossier' : 'Prepare my dossier'}
                  secondaryHref={lang === 'fr' ? '/mon-dossier' : '/my-dossier'}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
