import React from 'react';
import ArticleNavigation from '../elements/ArticleNavigation';
import type { ArticleSection } from '../ArticleWrapper';

interface ModernTemplateProps {
  title: string;
  sections: ArticleSection[];
  language: 'fr' | 'en';
}

const ModernTemplate: React.FC<ModernTemplateProps> = ({ title, sections, language }) => {
  return (
    <div className="template-modern">
      <ArticleNavigation sections={sections} language={language} />
      <h1 className="article-title">{title}</h1>

      {sections.map((s, idx) => (
        <section key={s.id} id={s.id} className="content-card" tabIndex={-1}>
          <div className="card-icon" aria-hidden="true">📘</div>
          <h2 className="section-title">{s.title}</h2>
          <div
            className="section-content"
            dangerouslySetInnerHTML={{ __html: s.html }}
          />
        </section>
      ))}
    </div>
  );
};

export default ModernTemplate;
