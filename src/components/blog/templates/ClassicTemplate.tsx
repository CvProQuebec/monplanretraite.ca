import React from 'react';
import ArticleNavigation from '../elements/ArticleNavigation';
import type { ArticleSection } from '../ArticleWrapper';

interface ClassicTemplateProps {
  title: string;
  sections: ArticleSection[];
  language: 'fr' | 'en';
}

const ClassicTemplate: React.FC<ClassicTemplateProps> = ({ title, sections, language }) => {
  // Heuristic mapping of section style
  const getSectionType = (s: ArticleSection, index: number) => {
    if (index === 0) return 'intro';
    const low = s.title.toLowerCase();
    if (low.includes('attention') || low.includes('avertissement') || low.includes('warning')) return 'warning';
    return 'main';
  };

  const t = {
    readMore: language === 'fr' ? "Lire l'article" : 'Read article',
  };

  return (
    <div className="template-classic">
      {/* Navigation sticky can be handled with position:sticky via CSS if desired */}
      <ArticleNavigation sections={sections} language={language} />

      <h1 className="article-title">{title}</h1>

      {sections.map((s, idx) => {
        const type = getSectionType(s, idx);
        return (
          <section key={s.id} id={s.id} className={`section section-${type}`} tabIndex={-1}>
            <h2 className="section-title">{s.title}</h2>
            <div
              className="section-content"
              // HTML already sanitized by ArticleWrapper (OQLF sanitizer)
              dangerouslySetInnerHTML={{ __html: s.html }}
            />
          </section>
        );
      })}
    </div>
  );
};

export default ClassicTemplate;
