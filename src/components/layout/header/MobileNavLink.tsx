
import React from "react";
import { Link, useLocation } from "react-router-dom";

interface MobileNavLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const MobileNavLink = ({ href, children, onClick, className = "" }: MobileNavLinkProps) => {
  const location = useLocation();
  
  const handleClick = () => {
    if (onClick) onClick();
    
    // Handle anchor links by scrolling after navigation
    if (href.includes('#')) {
      const [path, anchor] = href.split('#');
      if (path && location.pathname !== path) {
        // Navigate first, then scroll
        setTimeout(() => {
          const element = document.getElementById(anchor);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      } else if (anchor) {
        // Already on page, just scroll
        setTimeout(() => {
          const element = document.getElementById(anchor);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 50);
      }
    }
  };

  // Convert anchor links to proper React Router paths
  const getRouterPath = (href: string) => {
    if (href.startsWith('/#')) {
      return '/';
    } else if (href.startsWith('/en#')) {
      return '/en';
    }
    return href;
  };

  const routerPath = getRouterPath(href);
  
  return (
    <Link
      to={routerPath}
      className={`text-blue-900 hover:text-amber-600 py-2 transition-colors duration-300 w-full text-lg ${className}`}
      onClick={handleClick}
    >
      {children}
    </Link>
  );
};

export default MobileNavLink;
