import React from "react";
// Si react-helmet-async est installé, décommente :
// import { Helmet } from "react-helmet-async";

interface MetaProps {
  title: string;
  description: string;
  ogImage?: string;
  url?: string;
  lang?: string;
}

const Meta: React.FC<MetaProps> = ({ title, description, ogImage, url, lang }) => {
  // Fallback si pas de react-helmet-async
  React.useEffect(() => {
    document.title = title;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', description);
    else {
      const m = document.createElement('meta');
      m.name = 'description';
      m.content = description;
      document.head.appendChild(m);
    }
    // OpenGraph
    const ogTitle = document.querySelector('meta[property="og:title"]') || document.createElement('meta');
    ogTitle.setAttribute('property', 'og:title');
    ogTitle.setAttribute('content', title);
    document.head.appendChild(ogTitle);
    const ogDesc = document.querySelector('meta[property="og:description"]') || document.createElement('meta');
    ogDesc.setAttribute('property', 'og:description');
    ogDesc.setAttribute('content', description);
    document.head.appendChild(ogDesc);
    if (ogImage) {
      const ogImg = document.querySelector('meta[property="og:image"]') || document.createElement('meta');
      ogImg.setAttribute('property', 'og:image');
      ogImg.setAttribute('content', ogImage);
      document.head.appendChild(ogImg);
    }
    if (url) {
      const ogUrl = document.querySelector('meta[property="og:url"]') || document.createElement('meta');
      ogUrl.setAttribute('property', 'og:url');
      ogUrl.setAttribute('content', url);
      document.head.appendChild(ogUrl);
    }
    // Twitter
    const twTitle = document.querySelector('meta[name="twitter:title"]') || document.createElement('meta');
    twTitle.setAttribute('name', 'twitter:title');
    twTitle.setAttribute('content', title);
    document.head.appendChild(twTitle);
    const twDesc = document.querySelector('meta[name="twitter:description"]') || document.createElement('meta');
    twDesc.setAttribute('name', 'twitter:description');
    twDesc.setAttribute('content', description);
    document.head.appendChild(twDesc);
    if (ogImage) {
      const twImg = document.querySelector('meta[name="twitter:image"]') || document.createElement('meta');
      twImg.setAttribute('name', 'twitter:image');
      twImg.setAttribute('content', ogImage);
      document.head.appendChild(twImg);
    }
    if (lang) {
      document.documentElement.lang = lang;
    }
  }, [title, description, ogImage, url, lang]);

  // Si react-helmet-async est installé, utiliser ce bloc à la place :
  // return (
  //   <Helmet>
  //     <title>{title}</title>
  //     <meta name="description" content={description} />
  //     <meta property="og:title" content={title} />
  //     <meta property="og:description" content={description} />
  //     {ogImage && <meta property="og:image" content={ogImage} />}
  //     {url && <meta property="og:url" content={url} />}
  //     <meta name="twitter:title" content={title} />
  //     <meta name="twitter:description" content={description} />
  //     {ogImage && <meta name="twitter:image" content={ogImage} />}
  //     {lang && <html lang={lang} />}
  //   </Helmet>
  // );

  return null;
};

export default Meta; 