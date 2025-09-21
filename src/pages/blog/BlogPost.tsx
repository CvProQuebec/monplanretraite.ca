import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MarkdownIt from 'markdown-it';
import anchor from 'markdown-it-anchor';
import toc from 'markdown-it-table-of-contents';
import { getPostBySlug, getPrevNext, getAllPosts } from './utils/content';
import { useLanguage } from '@/features/retirement/hooks/useLanguage';
import ArticleWrapper from '@/components/blog/ArticleWrapper';
import './blog-templates.css';

type Props = {
  language?: 'fr' | 'en';
};

function sanitizeHtmlForOQLF(html: string): string {
  // Very conservative post-processing:
  // - Remove spaces before ! and ?.
  // - Ensure non-breaking space before ":" "%" "$".
  // We try to avoid code blocks by splitting on <code> and <pre> blocks.
  const segments: string[] = [];
  let remaining = html;
  const regex = /(<pre[\s\S]*?<\/pre>)|(<code[\s\S]*?<\/code>)/gi;
  let lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = regex.exec(html))) {
    // push preceding segment (process)
    const prev = html.slice(lastIndex, m.index);
    segments.push(processText(prev));
    // push code/pre as-is
    segments.push(m[0]);
    lastIndex = m.index + m[0].length;
  }
  // tail
  if (lastIndex < html.length) {
    segments.push(processText(html.slice(lastIndex)));
  }
  return segments.join('');

  function processText(input: string): string {
    let out = input;
    // remove spaces before ! and ?
    out = out.replace(/\s+(!|\?)/g, '$1');
    // non-breaking spaces before ":" "%" "$"
    // Colon: ensure nbsp before :
    out = out.replace(/\s*:\s*/g, '&nbsp;: ');
    // Percent: space insécable before %
    out = out.replace(/\s*%\b/g, '&nbsp;%');
    // Dollar before symbol: ensure space insécable before $
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
        slugify: (s: string) =>
          s
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9\s-]/g, '')
            .trim()
            .replace(/\s+/g, '-'),
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

const BlogPost: React.FC<Props> = ({ language }) => {
  const { slug } = useParams();
  const { language: uiLanguage } = useLanguage();
  const lang: 'fr' | 'en' = language || (uiLanguage === 'fr' ? 'fr' : 'en');
  const navigate = useNavigate();

  if (!slug) {
    navigate(lang === 'en' ? '/en/blog' : '/blog');
    return null;
  }

  const post = getPostBySlug(slug, lang);
  const { prev, next } = getPrevNext(slug, lang);
  const md = useMarkdownRenderer(lang);

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {lang === 'fr' ? 'Article introuvable' : 'Article not found'}
        </h1>
        <p className="text-gray-600 mb-6">
          {lang === 'fr'
            ? 'Nous n’avons pas pu trouver cet article.'
            : 'We could not find this article.'}
        </p>
        <button
          className="px-4 py-2 rounded bg-blue-600 text-white"
          onClick={() => navigate(lang === 'en' ? '/en/blog' : '/blog')}
        >
          {lang === 'fr' ? 'Retour au blog' : 'Back to blog'}
        </button>
      </div>
    );
  }

  // Determine counterpart slug in the other language
  const counterpartSlug = useMemo(() => {
    if (!post) return undefined;
    if (lang === 'fr') {
      if (post.relatedSlugEn) return post.relatedSlugEn;
      const enPosts = getAllPosts('en');
      // Try to find a post that references this FR slug
      const match = enPosts.find(
        (p) => p.relatedSlugFr === (post.relatedSlugFr || post.slug) || p.slug === post.relatedSlugEn
      );
      return match?.slug;
    } else {
      // lang === 'en'
      if (post.relatedSlugFr) return post.relatedSlugFr;
      const frPosts = getAllPosts('fr');
      const match = frPosts.find(
        (p) => p.relatedSlugEn === (post.relatedSlugEn || post.slug) || p.slug === post.relatedSlugFr
      );
      return match?.slug;
    }
  }, [post, lang]);

  const html = sanitizeHtmlForOQLF(md.render(post.content));

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-6 py-8">
        <article className="max-w-4xl mx-auto bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-10">
          {/* Header */}
          <header className="mb-6">
            <div className="text-xs text-blue-700 font-semibold mb-2">{post.category}</div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">{post.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
              <span>{new Date(post.date + 'T00:00:00').toLocaleDateString(lang === 'fr' ? 'fr-CA' : 'en-CA', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              <span>·</span>
              <span>{lang === 'fr' ? `${post.readingTime} min de lecture` : `${post.readingTime} min read`}</span>
              <button
                type="button"
                className="ml-auto px-3 py-1 rounded border border-blue-300 text-blue-700 hover:bg-blue-50 disabled:opacity-50"
                onClick={() => {
                  if (!counterpartSlug) return;
                  const base = lang === 'fr' ? '/en/blog/' : '/blog/';
                  navigate(base + counterpartSlug);
                }}
                disabled={!counterpartSlug}
                title={
                  counterpartSlug
                    ? (lang === 'fr' ? 'Lire cet article en anglais' : 'Read this article in French')
                    : (lang === 'fr' ? 'Version anglaise non disponible' : 'French version not available')
                }
              >
                {lang === 'fr' ? 'Lire en anglais' : 'Read in French'}
              </button>
            </div>
            {/* Tags */}
            {post.tags?.length ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {post.tags.map((t) => (
                  <span key={t} className="px-2 py-0.5 text-xs rounded bg-gray-100 text-gray-700">
                    #{t}
                  </span>
                ))}
              </div>
            ) : null}
          </header>

          {/* Key points */}
          {post.keyPoints && post.keyPoints.length > 0 && (
            <aside className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h2 className="text-lg font-semibold text-blue-900 mb-2">
                {lang === 'fr' ? 'Points clés' : 'Key Points'}
              </h2>
              <ul className="list-disc list-inside text-blue-900 space-y-1">
                {post.keyPoints.slice(0, 5).map((k, i) => (
                  <li key={i}>{k}</li>
                ))}
              </ul>
            </aside>
          )}

          {/* Table of contents marker (optional) */}
          {/* To enable ToC, insert "[toc]" line inside the markdown. */}

          {/* Article content with seniors-friendly template */}
          <ArticleWrapper
            language={lang}
            title={post.title}
            content={post.content}
            readingTime={post.readingTime}
          />

          {/* Navigation prev/next */}
          <nav className="mt-10 pt-6 border-t border-gray-200 flex items-center justify-between gap-3">
            <div>
              {prev && (
                <button
                  type="button"
                  className="text-left text-blue-700 hover:underline"
                  onClick={() => navigate((lang === 'en' ? '/en/blog/' : '/blog/') + prev.slug)}
                >
                  <span className="block text-gray-500">
                    {lang === 'fr' ? 'Article précédent' : 'Previous article'}
                  </span>
                  <span className="block text-gray-700 font-semibold">{prev.title}</span>
                </button>
              )}
            </div>
            <div className="ml-auto">
              {next && (
                <button
                  type="button"
                  className="text-right text-blue-700 hover:underline"
                  onClick={() => navigate((lang === 'en' ? '/en/blog/' : '/blog/') + next.slug)}
                >
                  <span className="block text-gray-500">
                    {lang === 'fr' ? 'Article suivant' : 'Next article'}
                  </span>
                  <span className="block text-gray-700 font-semibold">{next.title}</span>
                </button>
              )}
            </div>
          </nav>

          {/* Back to list */}
          <div className="mt-6">
            <button
              className="px-4 py-2 rounded bg-blue-600 text-white"
              onClick={() => navigate(lang === 'en' ? '/en/blog' : '/blog')}
            >
              {lang === 'fr' ? 'Retour au blog' : 'Back to blog'}
            </button>
          </div>
        </article>
      </div>
    </div>
  );
};

export default BlogPost;
