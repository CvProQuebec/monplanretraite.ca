import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/features/retirement/hooks/useLanguage';
import { getAllPosts, type BlogPost } from './utils/content';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, CheckCircle2, Circle, ArrowLeft } from 'lucide-react';

type ReadMap = Record<string, boolean>;

function useReadProgress(storageKey: string) {
  const [readMap, setReadMap] = useState<ReadMap>({});

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) setReadMap(JSON.parse(raw));
    } catch {}
  }, [storageKey]);

  const toggleRead = (id: string) => {
    setReadMap((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      try {
        localStorage.setItem(storageKey, JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  return { readMap, toggleRead };
}

const EssentialsPage: React.FC<{ language?: 'fr' | 'en' }> = ({ language }) => {
  const { language: uiLanguage } = useLanguage();
  const lang: 'fr' | 'en' = language || (uiLanguage === 'fr' ? 'fr' : 'en');
  const navigate = useNavigate();

  const all = useMemo(() => getAllPosts(lang), [lang]);

  // Curation: prioriser collection === 'essentiels', sinon featured === true, sinon les plus récents des catégories de base
  const essentials = useMemo<BlogPost[]>(() => {
    const byCollection = all.filter((p) => (p as any).collection === 'essentiels');
    if (byCollection.length > 0) {
      return [...byCollection].sort((a, b) => (a.priority ?? 999) - (b.priority ?? 999));
    }
    const featured = all.filter((p) => p.featured);
    if (featured.length > 0) {
      return [...featured].sort((a, b) => (a.priority ?? 999) - (b.priority ?? 999)).slice(0, 12);
    }
    // Fallback: top 12 latest
    return all.slice(0, 12);
  }, [all]);

  const storageKey = `mpr-blog-essentials-read-${lang}`;
  const { readMap, toggleRead } = useReadProgress(storageKey);

  const completed = Object.keys(readMap).filter((k) => readMap[k]).length;
  const total = essentials.length;
  const progressPct = total > 0 ? Math.round((completed / total) * 100) : 0;

  const t = {
    title: lang === 'fr' ? 'Guides essentiels' : 'Essential Guides',
    subtitle:
      lang === 'fr'
        ? 'Votre parcours de lecture en 10–12 articles pour maîtriser les bases'
        : 'Your 10–12 article reading path to master the basics',
    back: lang === 'fr' ? 'Retour au blog' : 'Back to blog',
    startReading: lang === 'fr' ? 'Commencer la lecture' : 'Start reading',
    continue: lang === 'fr' ? 'Continuer' : 'Continue',
    completed: lang === 'fr' ? 'Terminé' : 'Completed',
    progress: lang === 'fr' ? 'Progression' : 'Progress',
  };

  const openPost = (p: BlogPost) => navigate(`${lang === 'en' ? '/en/blog' : '/blog'}/${p.slug}`);

  return (
    <div className="min-h-screen bg-gradient-to-br from-mpr-interactive-lt via-white to-purple-50">
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">{t.title}</h1>
              <p className="text-gray-600 mt-1">{t.subtitle}</p>
            </div>
            <Button variant="outline" onClick={() => navigate(lang === 'en' ? '/en/blog' : '/blog')} className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              {t.back}
            </Button>
          </div>

          {/* Progress */}
          <div className="mb-6">
            <div className="flex items-center justify-between text-sm text-gray-700 mb-1">
              <span>{t.progress}: {completed}/{total}</span>
              <span>{progressPct}%</span>
            </div>
            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-3 bg-mpr-interactive rounded-full transition-all"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>

          {/* Timeline */}
          <div className="space-y-4">
            {essentials.map((p, idx) => {
              const isRead = !!readMap[p.id];
              return (
                <Card key={p.id} className="border-2 border-slate-200 bg-white">
                  <CardContent className="p-4 flex items-start gap-4">
                    <button
                      aria-label={isRead ? t.completed : 'Mark as read'}
                      onClick={() => toggleRead(p.id)}
                      className={`mt-1 rounded-full ${isRead ? 'text-green-600' : 'text-gray-400'} hover:text-mpr-interactive`}
                      title={isRead ? t.completed : 'Mark as read'}
                    >
                      {isRead ? <CheckCircle2 className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
                    </button>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 text-xs text-mpr-navy font-semibold">
                        <Star className="w-4 h-4" />
                        <span>{idx + 1 < 10 ? `0${idx + 1}` : idx + 1}</span>
                        <span>·</span>
                        <span>{p.category}</span>
                      </div>
                      <h2
                        className="text-lg md:text-xl font-bold text-gray-900 mt-1 mb-1 cursor-pointer hover:text-mpr-navy"
                        onClick={() => openPost(p)}
                      >
                        {p.title}
                      </h2>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-3">{p.excerpt}</p>
                      <div className="text-xs text-gray-500">
                        {new Date(p.date + 'T00:00:00').toLocaleDateString(
                          lang === 'fr' ? 'fr-CA' : 'en-CA',
                          { year: 'numeric', month: 'long', day: 'numeric' }
                        )}
                        {' · '}
                        {lang === 'fr' ? `${p.readingTime} min de lecture` : `${p.readingTime} min read`}
                      </div>
                    </div>
                    <div className="pt-1">
                      <Button onClick={() => openPost(p)}>{t.startReading}</Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EssentialsPage;
