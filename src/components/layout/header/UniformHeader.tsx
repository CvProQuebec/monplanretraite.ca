import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { BookOpen, ChevronDown, Compass, FolderOpen, Home, Menu, Shield, Wrench, X } from 'lucide-react';
import LanguageSelector from './LanguageSelector';

interface UniformHeaderProps {
  isEnglish: boolean;
}

type NavigationSubItem = {
  id: string;
  label: string;
  path: string;
};

type NavigationItem = {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  path?: string;
  hasSubmenu?: boolean;
  submenu?: NavigationSubItem[];
};

export const UniformHeader: React.FC<UniformHeaderProps> = ({ isEnglish }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  const navigationItems: NavigationItem[] = [
    {
      id: 'home',
      label: isEnglish ? 'Home' : 'Accueil',
      icon: Home,
      path: isEnglish ? '/en' : '/fr',
    },
    {
      id: 'start',
      label: isEnglish ? 'Start here' : 'Commencer',
      icon: Compass,
      path: isEnglish ? '/start-here' : '/commencer',
    },
    {
      id: 'tools',
      label: isEnglish ? 'Tools' : 'Mes outils',
      icon: Wrench,
      hasSubmenu: true,
      submenu: [
        {
          id: 'tools-all',
          label: isEnglish ? 'All tools' : 'Tous les outils',
          path: isEnglish ? '/tools' : '/outils',
        },
        {
          id: 'tools-situations',
          label: isEnglish ? 'By situation' : 'Par situation',
          path: isEnglish ? '/situations' : '/par-situation',
        },
        {
          id: 'tools-evaluation',
          label: isEnglish ? 'Assess my situation' : 'Évaluer ma situation',
          path: isEnglish ? '/tools#evaluation' : '/outils#evaluation',
        },
        {
          id: 'tools-income',
          label: isEnglish ? 'Retirement income' : 'Revenus de retraite',
          path: isEnglish ? '/tools#revenus' : '/outils#revenus',
        },
        {
          id: 'tools-tax',
          label: isEnglish ? 'Reduce my taxes' : 'Réduire mes impôts',
          path: isEnglish ? '/tools#impots' : '/outils#impots',
        },
        {
          id: 'tools-special',
          label: isEnglish ? 'Special situations' : 'Situations particulières',
          path: isEnglish ? '/tools#situations' : '/outils#situations',
        },
      ],
    },
    {
      id: 'dossier',
      label: isEnglish ? 'My dossier' : 'Mon dossier',
      icon: FolderOpen,
      hasSubmenu: true,
      submenu: [
        {
          id: 'dossier-home',
          label: isEnglish ? 'Prepare my dossier' : 'Préparer mon dossier',
          path: isEnglish ? '/my-dossier' : '/mon-dossier',
        },
        {
          id: 'dossier-reports',
          label: isEnglish ? 'My reports' : 'Mes rapports',
          path: isEnglish ? '/en/retirement-reports' : '/fr/rapports-retraite',
        },
        {
          id: 'dossier-save',
          label: isEnglish ? 'Save my data' : 'Sauvegarder mes données',
          path: isEnglish ? '/en/save-load' : '/fr/sauvegarder-charger',
        },
      ],
    },
    {
      id: 'trousse',
      label: isEnglish ? 'Emergency Kit' : 'Trousse',
      icon: Shield,
      path: isEnglish ? '/kit' : '/trousse',
    },
    {
      id: 'blog',
      label: isEnglish ? 'Guides' : 'Articles',
      icon: BookOpen,
      path: isEnglish ? '/en/blog' : '/blog',
    },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
    setOpenSubmenu(null);
  };

  const handleMenuClick = (item: NavigationItem) => {
    if (item.hasSubmenu) {
      setOpenSubmenu(openSubmenu === item.id ? null : item.id);
      return;
    }

    if (item.path) {
      handleNavigation(item.path);
    }
  };

  const isPathActive = (path: string) => {
    const cleanTarget = path.split('#')[0];
    const cleanCurrent = location.pathname;
    return cleanCurrent === cleanTarget || cleanCurrent.startsWith(cleanTarget + '/');
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openSubmenu && !(event.target as Element).closest('.submenu-container')) {
        setOpenSubmenu(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openSubmenu]);

  return (
    <header className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur" style={{ borderColor: 'var(--mpr-border)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex min-h-[72px] items-center justify-between gap-4">
          <button
            onClick={() => handleNavigation(isEnglish ? '/en' : '/fr')}
            className="flex items-center hover:opacity-80 transition-opacity"
            aria-label="MonPlanRetraite.ca"
          >
            <img
              src="/logo-planretraite.png"
              alt="MonPlanRetraite.ca"
              className="h-10 w-auto"
              onError={(event) => {
                const target = event.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
          </button>

          <nav className="hidden md:flex items-center gap-2 submenu-container">
            {navigationItems.map((item) => {
              const active = item.path ? isPathActive(item.path) : item.submenu?.some((sub) => isPathActive(sub.path));
              const Icon = item.icon;

              return (
                <div key={item.id} className="relative submenu-container">
                  <button
                    onClick={() => handleMenuClick(item)}
                    className={`flex min-h-[56px] items-center gap-2 rounded-xl px-4 text-[16px] font-semibold transition-colors ${
                      active
                        ? 'text-[color:var(--mpr-primary)] bg-[#f0f4ff]'
                        : 'text-[color:var(--mpr-text)] hover:bg-[#f8fafc]'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                    {item.hasSubmenu && (
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${openSubmenu === item.id ? 'rotate-180' : ''}`}
                      />
                    )}
                  </button>

                  {item.hasSubmenu && openSubmenu === item.id && (
                    <div
                      className="absolute right-0 top-full mt-2 w-72 rounded-2xl border bg-white p-2 shadow-lg"
                      style={{ borderColor: 'var(--mpr-border)' }}
                    >
                      {item.submenu?.map((subItem) => (
                        <button
                          key={subItem.id}
                          onClick={() => handleNavigation(subItem.path)}
                          className="flex min-h-[56px] w-full items-center rounded-xl px-4 text-left text-[16px] font-semibold text-[color:var(--mpr-text)] hover:bg-[#f8fafc]"
                        >
                          {subItem.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <LanguageSelector isEnglish={isEnglish} />
            <button
              onClick={() => setIsMobileMenuOpen((value) => !value)}
              className="md:hidden flex h-12 w-12 items-center justify-center rounded-xl border"
              style={{ borderColor: 'var(--mpr-border)' }}
              aria-label={isMobileMenuOpen ? (isEnglish ? 'Close menu' : 'Fermer le menu') : (isEnglish ? 'Open menu' : 'Ouvrir le menu')}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden border-t py-3" style={{ borderColor: 'var(--mpr-border)' }}>
            <div className="space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const active = item.path ? isPathActive(item.path) : item.submenu?.some((sub) => isPathActive(sub.path));

                return (
                  <div key={item.id}>
                    <button
                      onClick={() => handleMenuClick(item)}
                      className={`flex min-h-[56px] w-full items-center justify-between rounded-xl px-4 text-left ${
                        active
                          ? 'text-[color:var(--mpr-primary)] bg-[#f0f4ff]'
                          : 'text-[color:var(--mpr-text)] bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="h-5 w-5" />
                        <span className="text-[18px] font-semibold">{item.label}</span>
                      </div>
                      {item.hasSubmenu && (
                        <ChevronDown
                          className={`h-4 w-4 transition-transform ${openSubmenu === item.id ? 'rotate-180' : ''}`}
                        />
                      )}
                    </button>

                    {item.hasSubmenu && openSubmenu === item.id && (
                      <div className="mt-2 space-y-2 pl-4">
                        {item.submenu?.map((subItem) => (
                          <button
                            key={subItem.id}
                            onClick={() => handleNavigation(subItem.path)}
                            className="flex min-h-[52px] w-full items-center rounded-xl border bg-white px-4 text-left text-[16px] font-semibold text-[color:var(--mpr-text)]"
                            style={{ borderColor: 'var(--mpr-border)' }}
                          >
                            {subItem.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default UniformHeader;
