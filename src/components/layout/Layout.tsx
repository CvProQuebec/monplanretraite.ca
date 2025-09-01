import React from 'react';
import { useLocation } from 'react-router-dom';
import { UniformHeader } from './header/UniformHeader';
import { NavigationToggle } from '../../features/retirement/components/SeniorsAccessibilityToggle';
import { useLanguage } from '../../features/retirement/hooks/useLanguage';
import UnlockButton from '../ui/UnlockButton';

// Import du CSS d'accessibilité pour seniors - appliqué globalement
import '../../styles/accessibility-seniors.css';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const { language } = useLanguage();
  
  // Déterminer si on est sur une page anglaise
  // Priorité 1: Hook useLanguage, Priorité 2: URL
  const isEnglish = language === 'en' || location.pathname.startsWith('/en');
  
  // Pages qui n'ont pas besoin du header uniforme (par exemple, les pages avec leur propre navigation)
  const pagesWithCustomHeader = [
    '/fr/retraite-module-phase1',
    '/en/retirement-module-phase1'
  ];
  
  const shouldShowUniformHeader = !pagesWithCustomHeader.some(path => 
    location.pathname.startsWith(path)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 font-sans">
      {/* Header uniforme pour toutes les pages (sauf exceptions) */}
      {shouldShowUniformHeader && <UniformHeader isEnglish={isEnglish} />}
      
      {/* Boutons flottants - Navigation et déverrouillage */}
      <div className="fixed bottom-6 right-6 z-40 hidden md:block">
        <NavigationToggle />
      </div>
      
      {/* Bouton de déverrouillage discret */}
      <UnlockButton />
      
      <main>{children}</main>
    </div>
  );
};

export default Layout;
