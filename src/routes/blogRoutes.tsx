import React from 'react';
import { Route } from 'react-router-dom';

// Lazy-loaded blog pages (scoped to blog routes)
const BlogHome = React.lazy(() => import('@/pages/blog/BlogHome'));
const BlogPost = React.lazy(() => import('@/pages/blog/BlogPost'));
const CategoryPage = React.lazy(() => import('@/pages/blog/CategoryPage'));

/**
 * BlogRoutes
 * Regroupe la configuration des routes "blog" pour alléger App.tsx.
 * - Inclut: accueil du blog, articles, catégories, compat anciennes routes.
 * - N'inclut pas: pages "Essentiels" et "Outils" du blog (laissées dans App.tsx).
 */
export function BlogRoutes() {
  return (
    <>
      {/* Page principale du blog */}
      <Route path="/blog" element={<BlogHome />} />
      <Route path="/blog/:slug" element={<BlogPost />} />
      {/* English blog */}
      <Route path="/en/blog" element={<BlogHome language="en" />} />
      <Route path="/en/blog/:slug" element={<BlogPost language="en" />} />

      {/* Catégories du blog */}
      <Route path="/blog/categories" element={<BlogHome />} />
      <Route path="/blog/categorie/:slug" element={<CategoryPage />} />
      <Route path="/en/blog/categories" element={<BlogHome language="en" />} />
      <Route path="/en/blog/category/:slug" element={<CategoryPage language="en" />} />

      {/* Compat anciennes routes vers l'index des catégories */}
      <Route path="/blog/guides" element={<BlogHome />} />
      <Route path="/blog/conseils-experts" element={<BlogHome />} />
      <Route path="/blog/expert-tips" element={<BlogHome language="en" />} />
      <Route path="/blog/etudes-cas" element={<BlogHome />} />
      <Route path="/blog/case-studies" element={<BlogHome language="en" />} />
      <Route path="/blog/actualites-fiscales" element={<BlogHome />} />
      <Route path="/blog/tax-news" element={<BlogHome language="en" />} />
    </>
  );
}

export default BlogRoutes;
