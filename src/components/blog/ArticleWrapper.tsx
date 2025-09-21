import React, { useMemo } from 'react';
import MarkdownIt from 'markdown-it';
import anchor from 'markdown-it-anchor';
import toc from 'markdown-it-table-of-contents';
import ClassicTemplate from './templates/ClassicTemplate';
import ModernTemplate from './templates/ModernTemplate';
import MagazineTemplate from './templates/MagazineTemplate';
import InfographicTemplate from './templates/InfographicTemplate';

export interface ArticleSection {
  id: string;
  title: string;
  html: string;
}

export interface BlogArticleProps {
  language: 'fr' | 'en';
  title: string;
  content: string; // raw markdown
  readingTime: number;
}

type TemplateKind = 'classic' | 'modern' | 'magazine' | 'infographic';

function slugifyId(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

// Keep the same OQLF sanitization rules the app uses
function sanitizeHtmlForOQLF(html: string): string {
  const segments: string[] = [];
  const regex = /(<pre[\s\S]*?<\/pre>)|(<code[\s\S]*?<\/code>)/gi;
  let lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = regex.exec(html))) {
    const prev = html.slice(lastIndex, m.index);
    segments.push(processText(prev));
    segments.push(m[0]);
    lastIndex = m.index + m[0].length;
  }
  if (lastIndex < html.length) {
    segments.push(processText(html.slice(lastIndex)));
  }
  return segments.join('');

  function processText(input: string): string {
    let out = input;
    out = out.replace(/\s+(!|\?)/g, '$1');
    out = out.replace(/\s*:\s*/g, '&nbsp;: ');
    out = out.replace(/\s*%\b/g, '&nbsp;%');
    out = out.replace(/\s*\$/g, '&nbsp;$');
    return out;
  }
}

function useMarkdownRenderer(lang: 'fr' | 'en') {
  const md = useMemo(() => {
    const renderer = new MarkdownIt({
      html: true,
      linkify: true,
      typographer: true,
      breaks: false,
    })
      .use(anchor, {
        permalink: anchor.permalink.ariaHidden({
          placement: 'after',
          class: 'header-anchor',
          symbol: '#',
        }),
        slugify: slugifyId,
      })
      .use(toc, {
        includeLevel: [2, 3],
        containerClass: 'mpr-toc',
        markerPattern: /^\[toc\]/im,
      });
    return renderer;
  }, [lang]);
  return md;
}

/**
 * Split markdown into sections by H2 (##).
 * First section is considered intro if content precedes the first H2.
 */
function splitIntoSections(raw: string): { title: string; id: string; markdown: string }[] {
  const lines = raw.split(/\r?\n/);
  const sections: { title: string; id: string; markdown: string }[] = [];
  let currentTitle = 'Introduction';
  let currentId = 'intro';
  let buffer: string[] = [];

  const pushSection = () => {
    if (buffer.length === 0) return;
    sections.push({ title: currentTitle, id: currentId, markdown: buffer.join('\n').trim() });
    buffer = [];
  };

  for (const line of lines) {
    const h2 = line.match(/^##\s+(.+)/);
    if (h2) {
      // push previous
      pushSection();
      currentTitle = h2[1].trim();
      currentId = slugifyId(currentTitle) || `section-${sections.length + 1}`;
      continue;
    }
    buffer.push(line);
  }
  pushSection();
  return sections.length ? sections : [{ title: currentTitle, id: currentId, markdown: raw }];
}

export function getTemplateForArticle(title: string, readingTime: number, indexSeed = 0): TemplateKind {
  const t = (title || '').toLowerCase();
  if (t.includes('comment') || t.includes('how to') || t.includes('guide') || t.includes('steps') || t.includes('étapes')) {
    return 'infographic';
  }
  if (t.includes('calculateur') || t.includes('calculator') || t.includes('outil') || t.includes('tool') || t.includes('budget')) {
    return 'modern';
  }
  if (readingTime > 25) {
    return 'magazine';
  }
  const order: TemplateKind[] = ['classic', 'modern', 'magazine', 'infographic'];
  return order[indexSeed % order.length];
}

const ArticleWrapper: React.FC<BlogArticleProps> = ({ language, title, content, readingTime }) => {
  const md = useMarkdownRenderer(language);

  // Build sections
  const rawSections = useMemo(() => splitIntoSections(content), [content]);
  const sections: ArticleSection[] = useMemo(
    () =>
      rawSections.map((s) => ({
        id: s.id,
        title: s.title,
        html: sanitizeHtmlForOQLF(md.render(s.markdown)),
      })),
    [rawSections, md]
  );

  // Choose template
  const template = getTemplateForArticle(title, readingTime, Math.abs(slugifyId(title).length));

  // Render appropriate template (content already sanitized)
  switch (template) {
    case 'modern':
      return <ModernTemplate title={title} sections={sections} language={language} />;
    case 'magazine':
      return <MagazineTemplate title={title} sections={sections} language={language} />;
    case 'infographic':
      return <InfographicTemplate title={title} sections={sections} language={language} />;
    case 'classic':
    default:
      return <ClassicTemplate title={title} sections={sections} language={language} />;
  }
};

export default ArticleWrapper;
