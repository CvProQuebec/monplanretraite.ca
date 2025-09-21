import React from 'react';
import ArticleNavigation from '../elements/ArticleNavigation';
import type { ArticleSection } from '../ArticleWrapper';

interface MagazineTemplateProps {
  title: string;
  sections: ArticleSection[];
  language: 'fr' | 'en';
}

const MagazineTemplate: React.FC<MagazineTemplateProps> = ({ title, sections, language }) => {
  const hasAtLeastTwo = sections.length >= 2;
  const left = hasAtLeastTwo ? sections[0] : undefined;
  const right = hasAtLeastTwo ? sections[1] : undefined;
  const rest = hasAtLeastTwo ? sections.slice(2) : sections;

  return (
    <div className="template-magazine">
      <ArticleNavigation sections={sections} language={language} />
      <h1 className="article-title">{title}</h1>

      {/* Deux colonnes pour les 2 premières sections si disponibles */}
      {hasAtLeastTwo && (
        <div className="two-columns">
          {left && (
            <section id={left.id} className="mag-card" tabIndex={-1}>
              <h2 className="section-title">{left.title}</h2>
              <div
                className="section-content"
                dangerouslySetInnerHTML={{ __html: left.html }}
              />
            </section>
          )}
          {right && (
            <section id={right.id} className="mag-card" tabIndex={-1}>
              <h2 className="section-title">{right.title}</h2>
              <div
                className="section-content"
                dangerouslySetInnerHTML={{ __html: right.html }}
              />
            </section>
          )}
        </div>
      )}

      {/* Citation / mise en avant (si > 2 sections) */}
      {sections.length > 2 && (
        <div className="pull-quote">
          {language === 'fr'
            ? '« Les décisions simples, prises tôt, valent mieux que les plans complexes jamais réalisés. »'
            : '“Simple decisions taken early beat complex plans never executed.”'}
        </div>
      )}

      {/* Le reste des sections en cartes pleine largeur */}
      {rest.map((s) => (
        <section key={s.id} id={s.id} className="mag-card" tabIndex={-1}>
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

export default MagazineTemplate;
