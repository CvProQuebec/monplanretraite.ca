import React from 'react';
import { useMobileDetection } from '@/features/retirement/hooks/useMobileDetection';

interface MobileAwareProps {
  children: React.ReactNode;
  hideOnMobile?: boolean;
  showOnMobile?: boolean;
  className?: string;
  mobileClassName?: string;
  desktopClassName?: string;
}

/**
 * Composant utilitaire pour afficher/masquer conditionnellement des éléments selon le type d'appareil
 * 
 * @param hideOnMobile - Masque l'élément sur mobile
 * @param showOnMobile - Affiche l'élément seulement sur mobile
 * @param className - Classe CSS appliquée dans tous les cas
 * @param mobileClassName - Classe CSS appliquée seulement sur mobile
 * @param desktopClassName - Classe CSS appliquée seulement sur desktop
 */
const MobileAware: React.FC<MobileAwareProps> = ({
  children,
  hideOnMobile = false,
  showOnMobile = false,
  className = '',
  mobileClassName = '',
  desktopClassName = ''
}) => {
  const isMobile = useMobileDetection();

  // Si hideOnMobile est true et qu'on est sur mobile, ne pas afficher
  if (hideOnMobile && isMobile) {
    return null;
  }

  // Si showOnMobile est true et qu'on n'est pas sur mobile, ne pas afficher
  if (showOnMobile && !isMobile) {
    return null;
  }

  // Détermine les classes CSS à appliquer
  const finalClassName = [
    className,
    isMobile ? mobileClassName : desktopClassName
  ].filter(Boolean).join(' ');

  return (
    <div className={finalClassName}>
      {children}
    </div>
  );
};

export default MobileAware;
