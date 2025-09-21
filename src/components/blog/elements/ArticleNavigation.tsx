import React from 'react';
import type { ArticleSection } from '../ArticleWrapper';

/**
 * ArticleNavigation
 * Policy update: Quick navigation popups/sidebars are removed site-wide.
 * This component is intentionally a no-op to prevent any rendering.
 */
interface Props {
  sections: ArticleSection[];
  language: 'fr' | 'en';
}

const ArticleNavigation: React.FC<Props> = () => {
  return null;
};

export default ArticleNavigation;
