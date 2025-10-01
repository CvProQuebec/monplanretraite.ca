import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/features/retirement/hooks/useLanguage";
import { getPostBySlug, getAllPosts } from "@/pages/blog/utils/content";

interface LanguageSelectorProps {
  isEnglish: boolean;
}

const routeMapping: { [key: string]: string } = {
  // FR -> EN
  "/": "/en",
  "/accueil": "/home",
  "/mon-profil": "/my-profile",
  "/ma-retraite": "/my-retirement",
  "/mes-revenus": "/my-income",
  "/fr": "/en",
  "/fr/retraite": "/en/retirement",
  "/fr/retraite-entree": "/en/retirement-entry",
  "/fr/retraite-module": "/en/retirement-module",
  "/fr/retraite-module-phase1": "/en/retirement-module-phase1",
  "/fr/rapports-retraite": "/en/retirement-reports",
  "/fr/sauvegarder-charger": "/en/save-load",
  "/planification-urgence": "/emergency-planning",
  
  // EN -> FR
  "/en": "/fr",
  "/home": "/accueil",
  "/my-profile": "/mon-profil",
  "/my-retirement": "/ma-retraite",
  "/my-income": "/mes-revenus",
  "/en/retirement": "/fr/retraite",
  "/en/retirement-entry": "/fr/retraite-entree",
  "/en/retirement-module": "/fr/retraite-module",
  "/en/retirement-module-phase1": "/fr/retraite-module-phase1",
  "/en/retirement-reports": "/fr/rapports-retraite",
  "/en/save-load": "/fr/sauvegarder-charger",
  "/emergency-planning": "/planification-urgence",
};

const LanguageSelector = ({ isEnglish }: LanguageSelectorProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { language, setLanguage } = useLanguage();

  const handleLanguageToggle = () => {
    const newLang = language === 'fr' ? 'en' : 'fr';
    setLanguage(newLang);
    
    // Navigation basée sur le mapping des routes
    const currentPath = location.pathname;
    let newPath = '/';

    if (newLang === 'en') {
      if (currentPath.startsWith('/blog')) {
        // FR blog -> EN blog (preserve slug and map special routes)
        if (currentPath === '/blog' || currentPath === '/blog/') {
          newPath = '/en/blog';
        } else if (currentPath.startsWith('/blog/essentiels')) {
          newPath = currentPath.replace('/blog/essentiels', '/en/blog/essentials');
        } else if (currentPath.startsWith('/blog/outils')) {
          newPath = currentPath.replace('/blog/outils', '/en/blog/tools');
        } else if (currentPath.startsWith('/blog/categorie/')) {
          newPath = currentPath.replace('/blog/categorie/', '/en/blog/category/');
        } else {
          // Article detail FR -> EN with counterpart slug if available
          const m = currentPath.match(/^\/blog\/([^/]+)\/?$/);
          if (m) {
            const frSlug = m[1];
            const frPost = getPostBySlug(frSlug, 'fr');
            let enSlug = frPost?.relatedSlugEn;
            if (!enSlug) {
              const enPosts = getAllPosts('en');
              const match = enPosts.find(
                (p) => p.relatedSlugFr === (frPost?.relatedSlugFr || frSlug) || p.slug === frPost?.relatedSlugEn
              );
              enSlug = match?.slug || frSlug;
            }
            newPath = '/en/blog/' + enSlug;
          } else {
            newPath = '/en' + currentPath;
          }
        }
      } else if (currentPath.startsWith('/en')) {
        newPath = currentPath;
      } else if (routeMapping[currentPath]) {
        newPath = routeMapping[currentPath];
      } else if (currentPath.startsWith('/fr/')) {
        newPath = '/en' + currentPath.slice(3);
      } else if (currentPath === '/fr') {
        newPath = '/en';
      } else {
        newPath = '/en';
      }
    } else { // newLang === 'fr'
      if (currentPath.startsWith('/en/blog')) {
        // EN blog -> FR blog (preserve slug and map special routes)
        if (currentPath === '/en/blog' || currentPath === '/en/blog/') {
          newPath = '/blog';
        } else if (currentPath.startsWith('/en/blog/essentials')) {
          newPath = currentPath.replace('/en/blog/essentials', '/blog/essentiels');
        } else if (currentPath.startsWith('/en/blog/tools')) {
          newPath = currentPath.replace('/en/blog/tools', '/blog/outils');
        } else if (currentPath.startsWith('/en/blog/category/')) {
          newPath = currentPath.replace('/en/blog/category/', '/blog/categorie/');
        } else {
          // Article detail EN -> FR with counterpart slug if available
          const m = currentPath.match(/^\/en\/blog\/([^/]+)\/?$/);
          if (m) {
            const enSlug = m[1];
            const enPost = getPostBySlug(enSlug, 'en');
            let frSlug = enPost?.relatedSlugFr;
            if (!frSlug) {
              const frPosts = getAllPosts('fr');
              const match = frPosts.find(
                (p) => p.relatedSlugEn === (enPost?.relatedSlugEn || enSlug) || p.slug === enPost?.relatedSlugFr
              );
              frSlug = match?.slug || enSlug;
            }
            newPath = '/blog/' + frSlug;
          } else {
            newPath = currentPath.replace(/^\/en/, '');
          }
        }
      } else if (routeMapping[currentPath]) {
        // Direct mapping (handles routes like /my-income, /home, etc.)
        newPath = routeMapping[currentPath];
      } else if (currentPath.startsWith('/en/')) {
        newPath = '/fr' + currentPath.slice(3);
      } else if (currentPath === '/en') {
        newPath = '/fr';
      } else {
        newPath = '/fr';
      }
    }
    navigate(newPath);
  };

  return (
    <button
      onClick={handleLanguageToggle}
      className={cn(
        "flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200",
        "bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200",
        "border border-blue-200 hover:border-blue-300",
        "text-blue-900 hover:text-blue-700",
        "shadow-sm hover:shadow-md",
        "transform hover:scale-105 active:scale-95"
      )}
      title={language === 'fr' ? 'Switch to English' : 'Passer en français'}
    >
      <Globe className="h-4 w-4" />
      <span className="font-medium text-sm">
        {language === 'fr' ? 'FR' : 'EN'}
      </span>
    </button>
  );
};

export default LanguageSelector;
