import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/features/retirement/hooks/useLanguage';
import { getCategoryCounts, slugifyCategory } from './utils/content';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FolderOpen, ArrowLeft } from 'lucide-react';

const CategoryIndex: React.FC<{ language?: 'fr' | 'en' }> = ({ language }) => {
  const { language: uiLanguage } = useLanguage();
  const lang: 'fr' | 'en' = language || (uiLanguage === 'fr' ? 'fr' : 'en');
  const navigate = useNavigate();

  const counts = useMemo(() => getCategoryCounts(lang), [lang]);

  const t = {
    title: lang === 'fr' ? 'Catégories du blog' : 'Blog categories',
    subtitle:
      lang === 'fr'
        ? 'Parcourez tous les articles par grand thème'
        : 'Browse all articles by major theme',
    back: lang === 'fr' ? 'Retour au blog' : 'Back to blog',
    articles: (n: number) => (lang === 'fr' ? `${n} article${n > 1 ? 's' : ''}` : `${n} article${n > 1 ? 's' : ''}`),
  };

  const openCategory = (label: string) => {
    const base = lang === 'en' ? '/en/blog/category' : '/blog/categorie';
    navigate(`${base}/${slugifyCategory(label)}`);
  };

  const backToBlog = () => navigate(lang === 'en' ? '/en/blog' : '/blog');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-6 py-10">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">{t.title}</h1>
              <p className="text-gray-600 mt-1">{t.subtitle}</p>
            </div>
            <Button onClick={backToBlog} variant="outline" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              {t.back}
            </Button>
          </div>

          {/* Category grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {counts.map(({ category, count }) => (
              <Card
                key={category}
                className="cursor-pointer hover:shadow-lg transition-shadow border-2 border-slate-200"
                onClick={() => openCategory(category)}
                title={category}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded bg-blue-100 text-blue-700">
                      <FolderOpen className="w-5 h-5" />
                    </div>
                    <CardTitle className="text-lg text-gray-900">{category}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="text-sm text-slate-600">{t.articles(count)}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryIndex;
