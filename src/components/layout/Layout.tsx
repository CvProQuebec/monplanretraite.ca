import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { AdaptiveHeader } from './header/AdaptiveHeader';
import { useLanguage } from '../../features/retirement/hooks/useLanguage';
import UnlockButton from '../ui/UnlockButton';
import { SeniorsOptimizationService } from '../../services/SeniorsOptimizationService';

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
  
  // Préchargement séquentiel des modules critiques pour seniors
  useEffect(() => {
    SeniorsOptimizationService.preloadCriticalModules();
  }, []);
  

  return (
    <div className="seniors-mode high-contrast min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 font-sans">
      {/* Header adaptatif - ancienne navigation + 4 blocs seniors uniquement sur accueil */}
      <AdaptiveHeader isEnglish={isEnglish} />
      
      {/* Boutons flottants - (Navigation toggle retiré pour mode seniors par défaut) */}
      
      {/* Bouton de déverrouillage discret */}
      <UnlockButton />
      
      <main>{children}</main>
    </div>
  );
};

export default Layout;
