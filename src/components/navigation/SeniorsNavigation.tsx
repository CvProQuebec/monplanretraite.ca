import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export interface NavigationPage {
  key: string;
  label: string;          // Texte explicite
  description: string;    // Explication de la page
  icon?: React.ReactNode; // Icône large et claire
}

interface SeniorsNavigationProps {
  title?: string;
  subtitle?: string;
  pages: NavigationPage[];
  className?: string;
}

export function SeniorsNavigation({ title = 'Menu principal', subtitle = 'Cliquez sur la section désirée', pages, className = '' }: SeniorsNavigationProps) {
  const location = useLocation();

  const isActive = (key: string) => {
    // Active si chemin exact ou commence par le key
    return location.pathname === key || location.pathname.startsWith(key);
  };

  return (
    <nav className={`seniors-nav ${className}`}>
      <div className="nav-header sr-only">
        <h2>{title}</h2>
        <p>{subtitle}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-1">
        {pages.map((page) => (
          <Link
            key={page.key}
            to={page.key}
            className={`nav-item clickable-area navigation-link ${isActive(page.key) ? 'active' : ''}`}
            aria-label={page.label}
          >
            <div className="nav-item-content flex items-center gap-2">
              {page.icon && <div className="nav-icon text-base" aria-hidden="true">{page.icon}</div>}
              <div className="nav-text">
                <h3 className="nav-title text-base font-semibold">{page.label}</h3>
                <p className="nav-description text-sm text-gray-700">{page.description}</p>
              </div>
              <div className="nav-arrow ml-auto text-base" aria-hidden="true">→</div>
            </div>
          </Link>
        ))}
      </div>
    </nav>
  );
}

export default SeniorsNavigation;
