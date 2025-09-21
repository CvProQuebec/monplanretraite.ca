import React from 'react';
import ArticleNavigation from '../elements/ArticleNavigation';
import type { ArticleSection } from '../ArticleWrapper';

interface InfographicTemplateProps {
  title: string;
  sections: ArticleSection[];
  language: 'fr' | 'en';
}

const InfographicTemplate: React.FC<InfographicTemplateProps> = ({ title, sections, language }) => {
  return (
    <div className="template-infographic">
      <ArticleNavigation sections={sections} language={language} />
      <h1 className="article-title">{title}</h1>

      {sections.map((s, idx) => (
        <section key={s.id} id={s.id} className="info-block" tabIndex={-1}>
          <div className="info-number" aria-hidden="true">{idx + 1}</div>
          <div className="info-body">
            <h2 className="info-title">{s.title}</h2>
            <div
              className="info-content"
              dangerouslySetInnerHTML={{ __html: s.html }}
            />
          </div>
        </section>
      ))}
    </div>
  );
};

export default InfographicTemplate;
