import React, { useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '@/features/retirement/hooks/useLanguage';
import { getCategoryCounts, getCategoryDescription, getCategoryDisplayLabel, slugifyCategory } from './utils/content';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Meta from '@/components/ui/Meta';
import NextStepPanel from '@/components/ui/NextStepPanel';
import { FolderOpen, ArrowLeft } from 'lucide-react';

const CategoryIndex: React.FC<{ language?: 'fr' | 'en' }> = ({ language }) => {
  const { language: uiLanguage } = useLanguage();
  const location = useLocation();
  const pathLang: 'fr' | 'en' = location.pathname.startsWith('/en/') ? 'en' : 'fr';
  const lang: 'fr' | 'en' = language || pathLang || (uiLanguage === 'fr' ? 'fr' : 'en');
  const navigate = useNavigate();

  const counts = useMemo(() => getCategoryCounts(lang), [lang]);

  const categoryLabel = (cat: string) => getCategoryDisplayLabel(cat, lang);

  const t = {
    title: lang === 'fr' ? 'Categories du blog' : 'Blog categories',
    subtitle:
      lang === 'fr'
        ? 'Parcourez tous les articles par grand theme'
        : 'Browse all articles by major theme',
    back: lang === 'fr' ? 'Retour au blog' : 'Back to blog',
    articles: (n: number) => `${n} article${n > 1 ? 's' : ''}`,
  };

  const openCategory = (label: string) => {
    const base = lang === 'en' ? '/en/blog/category' : '/blog/categorie';
    navigate(`${base}/${slugifyCategory(label)}`);
  };

  const backToBlog = () => navigate(lang === 'en' ? '/en/blog' : '/blog');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Meta
        title={
          lang === 'fr'
            ? 'Categories du blog retraite | MonPlanRetraite.ca'
            : 'Retirement blog categories | MonPlanRetraite.ca'
        }
        description={
          lang === 'fr'
            ? 'Parcourez les grandes categories du blog pour trouver plus vite les articles qui correspondent a votre situation.'
            : 'Browse the main blog categories to find the articles that best match your situation.'
        }
        lang={lang}
      />
      <div className="container mx-auto px-6 py-10">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">{t.title}</h1>
              <p className="mt-1 text-gray-600">{t.subtitle}</p>
            </div>
            <Button onClick={backToBlog} variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              {t.back}
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {counts.map(({ category, count }) => (
              <Card
                key={category}
                className="cursor-pointer border-2 border-slate-200 transition-shadow hover:shadow-lg"
                onClick={() => openCategory(category)}
                title={categoryLabel(category)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <div className="rounded bg-blue-100 p-2 text-blue-700">
                      <FolderOpen className="h-5 w-5" />
                    </div>
                    <CardTitle className="text-lg text-gray-900">{categoryLabel(category)}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="mb-3 text-sm leading-6 text-slate-600">{getCategoryDescription(category, lang)}</p>
                  <div className="text-sm text-slate-600">{t.articles(count)}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-8">
            <NextStepPanel
              title={lang === 'fr' ? 'Par ou commencer' : 'Where to start'}
              text={
                lang === 'fr'
                  ? 'Choisissez une categorie pour vous informer, puis passez a un outil concret ou commencez votre dossier pour votre rendez-vous.'
                  : 'Choose a category to learn, then move to a concrete tool or start your dossier for your appointment.'
              }
              primaryLabel={lang === 'fr' ? 'Voir mes outils retraite' : 'See my retirement tools'}
              primaryHref={lang === 'fr' ? '/outils' : '/tools'}
              secondaryLabel={lang === 'fr' ? 'Preparer mon dossier' : 'Prepare my dossier'}
              secondaryHref={lang === 'fr' ? '/mon-dossier' : '/my-dossier'}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryIndex;
