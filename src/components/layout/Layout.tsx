import React from 'react';
import { useLocation } from 'react-router-dom';
import { UniformHeader } from './header/UniformHeader';
import { SeniorsAccessibilityToggle } from '../../features/retirement/components/SeniorsAccessibilityToggle';

// Import du CSS d'accessibilité pour seniors - appliqué globalement
import '../../styles/accessibility-seniors.css';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  
  // Déterminer si on est sur une page anglaise
  const isEnglish = location.pathname.startsWith('/en');
  
  // Pages qui n'ont pas besoin du header uniforme (par exemple, les pages avec leur propre navigation)
  const pagesWithCustomHeader = [
    '/fr/retraite-module',
    '/en/retirement-module',
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
      
      {/* Bouton d'accessibilité seniors - Disponible sur toutes les pages */}
      <div className="fixed top-4 right-4 z-50">
        <SeniorsAccessibilityToggle />
      </div>
      
      <main>{children}</main>
    </div>
  );
};

export default Layout;
