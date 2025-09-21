import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/features/retirement/hooks/useLanguage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Hammer, Calculator, BookOpen, ArrowLeft, ArrowRight } from 'lucide-react';

const ToolsPage: React.FC<{ language?: 'fr' | 'en' }> = ({ language }) => {
  const { language: uiLanguage } = useLanguage();
  const lang: 'fr' | 'en' = language || (uiLanguage === 'fr' ? 'fr' : 'en');
  const navigate = useNavigate();

  const t = {
    title: lang === 'fr' ? 'Outils & ressources' : 'Tools & resources',
    subtitle:
      lang === 'fr'
        ? 'Accédez rapidement aux calculateurs et guides populaires'
        : 'Quick access to popular calculators and guides',
    back: lang === 'fr' ? 'Retour au blog' : 'Back to blog',
    coastfireTitle: lang === 'fr' ? 'Liberté financière (CoastFIRE)' : 'Financial Freedom (CoastFIRE)',
    coastfireDesc:
      lang === 'fr'
        ? 'Calculez l’âge où vous pouvez cesser d’épargner activement pour la retraite.'
        : 'Calculate the age where you can stop actively saving for retirement.',
    tipsTitle: lang === 'fr' ? '99 trucs pour économiser' : '99 money-saving tips',
    tipsDesc:
      lang === 'fr'
        ? 'Des idées concrètes pour réduire vos dépenses sans vous priver.'
        : 'Concrete ideas to lower your expenses without sacrificing lifestyle.',
    open: lang === 'fr' ? 'Ouvrir' : 'Open',
    moreTools: lang === 'fr' ? 'Voir plus d’outils dans le Budget' : 'See more tools in Budget',
  };

  const openBudgetTab = (tab: 'coastfire' | 'tips') => {
    // Deep-link to Budget tabs
    navigate(`/budget?tab=${tab}`);
  };

  const backToBlog = () => navigate(lang === 'en' ? '/en/blog' : '/blog');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">{t.title}</h1>
              <p className="text-gray-600 mt-1">{t.subtitle}</p>
            </div>
            <Button variant="outline" onClick={backToBlog} className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              {t.back}
            </Button>
          </div>

          {/* Tools grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-2 border-slate-200 hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded bg-blue-100 text-blue-700">
                    <Calculator className="w-5 h-5" />
                  </div>
                  <CardTitle className="text-lg text-gray-900">{t.coastfireTitle}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">{t.coastfireDesc}</p>
                <Button onClick={() => openBudgetTab('coastfire')} className="bg-blue-600 hover:bg-blue-700 text-white">
                  {t.open}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>

            <Card className="border-2 border-slate-200 hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded bg-emerald-100 text-emerald-700">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <CardTitle className="text-lg text-gray-900">{t.tipsTitle}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">{t.tipsDesc}</p>
                <Button onClick={() => openBudgetTab('tips')} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                  {t.open}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Footer CTA */}
          <div className="mt-8">
            <Button variant="outline" onClick={() => navigate('/budget')} className="gap-2">
              <Hammer className="w-4 h-4" />
              {t.moreTools}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToolsPage;
