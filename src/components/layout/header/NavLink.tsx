
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

const NavLink = ({ href, children, className = "" }: NavLinkProps) => {
  const location = useLocation();
  
  // Handle anchor links by scrolling to element after navigation
  const handleAnchorClick = (targetHref: string) => {
    if (targetHref.includes('#')) {
      const [path, anchor] = targetHref.split('#');
      if (path && location.pathname !== path) {
        // Navigate to page first, then scroll will be handled by useEffect
        setTimeout(() => {
          const element = document.getElementById(anchor);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      } else if (anchor) {
        // Already on page, just scroll
        const element = document.getElementById(anchor);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
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
      onClick={() => handleAnchorClick(href)}
      className={cn(
        "transition-colors duration-300 relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-amber-600 after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left",
        className
      )}
    >
      {children}
    </Link>
  );
};

export default NavLink;
