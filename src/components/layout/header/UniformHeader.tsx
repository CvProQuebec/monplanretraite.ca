import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Menu,
  X,
  Home,
  Calculator,
  FileText,
  ChevronDown,
  Database,
  TrendingUp,
  DollarSign,
  BarChart3,
  Building
} from 'lucide-react';
import LanguageSelector from './LanguageSelector';

interface UniformHeaderProps {
  isEnglish: boolean;
}

export const UniformHeader: React.FC<UniformHeaderProps> = ({ isEnglish }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  // Navigation items avec sous-menus
  const navigationItems = [
    {
      id: 'home',
      label: isEnglish ? 'Home' : 'Accueil',
      icon: Home,
      path: isEnglish ? '/' : '/',
      hasSubmenu: false
    },
    {
      id: 'dashboard',
      label: isEnglish ? 'My Retirement' : 'Ma Retraite',
      icon: TrendingUp,
      path: isEnglish ? '/my-retirement' : '/ma-retraite',
      hasSubmenu: false
    },
    {
      id: 'income',
      label: isEnglish ? 'Income' : 'Revenus',
      icon: DollarSign,
      path: isEnglish ? '/my-income' : '/mes-revenus',
      hasSubmenu: false
    },
    {
      id: 'expenses',
      label: isEnglish ? 'Expenses' : 'Dépenses',
      icon: Calculator,
      path: isEnglish ? '/expenses' : '/depenses',
      hasSubmenu: false
    },
    {
      id: 'budget',
      label: isEnglish ? 'Budget' : 'Budget',
      icon: BarChart3,
      path: isEnglish ? '/my-budget' : '/mon-budget',
      hasSubmenu: false
    },
    {
      id: 'real-estate',
      label: isEnglish ? 'Real Estate' : 'Immobilier',
      icon: Home,
      path: isEnglish ? '/real-estate' : '/immobilier',
      hasSubmenu: false
    },
    {
      id: 'government-benefits',
      label: isEnglish ? 'Government' : 'Gouvernement',
      icon: Building,
      hasSubmenu: true,
      submenu: [
        {
          id: 'srg-module',
          label: isEnglish ? 'SRG (GIS) Module' : 'Module SRG (GIS)',
          path: '/module-srg'
        },
        {
          id: 'rregop-module',
          label: isEnglish ? 'RREGOP Module' : 'Module RREGOP',
          path: '/module-rregop'
        },
        {
          id: 'rrq-cpp',
          label: isEnglish ? 'RRQ/CPP Analysis' : 'Analyse RRQ/CPP',
          path: '/rrq-cpp-analysis'
        }
      ]
    },
    {
      id: 'tools',
      label: isEnglish ? 'Tools' : 'Outils',
      icon: Calculator,
      hasSubmenu: false,
      path: isEnglish ? '/tools' : '/outils',
      submenu: [
        // 🟢 OUTILS GRATUITS
        {
          id: 'free-tools-header',
          label: isEnglish ? '🟢 FREE TOOLS' : '🟢 OUTILS GRATUITS',
          isHeader: true
        },
        {
          id: 'assistant',
          label: isEnglish ? 'Financial Assistant' : 'Assistant financier',
          path: isEnglish ? '/financial-assistant' : '/assistant-financier',
          planLevel: 'free'
        },
        {
          id: 'emergency-info',
          label: isEnglish ? 'Emergency Planning' : 'Planification d\'urgence',
          path: isEnglish ? '/emergency-planning' : '/planification-urgence',
          planLevel: 'free'
        },
        {
          id: 'expenses-planning',
          label: isEnglish ? 'Expense Planning' : 'Planification de dépenses',
          path: isEnglish ? '/expense-planning' : '/planification-depenses',
          planLevel: 'free'
        },

        // 🔵 OUTILS PROFESSIONNELS
        {
          id: 'professional-tools-header',
          label: isEnglish ? '🔵 PROFESSIONAL TOOLS' : '🔵 OUTILS PROFESSIONNELS',
          isHeader: true
        },
        {
          id: 'advanced-performance',
          label: isEnglish ? 'Advanced Performance Calculator' : 'Calculette de rendement avancée',
          path: isEnglish ? '/advanced-performance-calculator' : '/calculette-rendement-avancee',
          planLevel: 'professional'
        },
        {
          id: 'four-percent-rule',
          label: isEnglish ? '4% Rule Analysis' : 'Analyse Règle 4%',
          path: isEnglish ? '/four-percent-rule' : '/regle-4-pourcent',
          planLevel: 'professional'
        },
        {
          id: 'optimal-allocation',
          label: isEnglish ? 'Optimal Allocation' : 'Allocation Optimale',
          path: '/module-allocation-optimale',
          planLevel: 'professional'
        },
        {
          id: 'celiapp',
          label: 'CELIAPP',
          path: '/celiapp',
          planLevel: 'professional'
        },
        {
          id: 'asset-consolidation',
          label: isEnglish ? 'Asset Consolidation' : 'Consolidation d\'Actifs',
          path: '/module-consolidation-actifs',
          planLevel: 'professional'
        },
        {
          id: 'financial-consolidation',
          label: isEnglish ? 'Financial Consolidation' : 'Consolidation Financière',
          path: isEnglish ? '/financial-consolidation' : '/consolidation-financiere',
          planLevel: 'professional'
        },
        {
          id: 'healthcare-costs',
          label: isEnglish ? 'Healthcare Costs' : 'Coûts de Santé',
          path: isEnglish ? '/healthcare-costs' : '/couts-sante',
          planLevel: 'professional'
        },
        {
          id: 'excess-liquidity',
          label: isEnglish ? 'Excess Liquidity Detector' : 'Détecteur Liquidités Excessives',
          path: '/detecteur-liquidites-excessives',
          planLevel: 'professional'
        },
        {
          id: 'tax-impact-65',
          label: isEnglish ? 'Tax Impact at 65' : 'Impact Fiscal à 65 ans',
          path: '/calculateur-impact-fiscal-65',
          planLevel: 'professional'
        },
        {
          id: 'ferr-optimization',
          label: isEnglish ? 'RRIF Optimization' : 'Optimisation FERR',
          path: isEnglish ? '/ferr-optimization' : '/optimisation-ferr',
          planLevel: 'professional'
        },
        {
          id: 'multi-source-tax',
          label: isEnglish ? 'Multi-Source Tax Optimization' : 'Optimisation Fiscale Multi-Sources',
          path: isEnglish ? '/multi-source-tax-optimization' : '/optimisation-fiscale-multi-sources',
          planLevel: 'professional'
        },
        {
          id: 'cpp-timing',
          label: isEnglish ? 'CPP Timing Optimization' : 'Optimisation Timing CPP',
          path: isEnglish ? '/cpp-timing' : '/optimisation-timing-cpp',
          planLevel: 'professional'
        },
        {
          id: 'rrq-quick-compare',
          label: isEnglish ? 'RRQ/CPP Quick Compare' : 'Comparateur RRQ/CPP',
          path: '/rrq-quick-compare',
          planLevel: 'free'
        },
        {
          id: 'rrq-delay-simulator',
          label: isEnglish ? 'RRQ/CPP Defer by X Months' : 'Report RRQ/CPP de X mois',
          path: '/rrq-delay-simulator',
          planLevel: 'free'
        },
        {
          id: 'longevity-planning',
          label: isEnglish ? 'Longevity Planning' : 'Planification Longévité',
          path: isEnglish ? '/longevity-planning' : '/planification-longevite',
          planLevel: 'professional'
        },
        {
          id: 'dynamic-withdrawal',
          label: isEnglish ? 'Dynamic Withdrawal Planning' : 'Planification Retrait Dynamique',
          path: isEnglish ? '/dynamic-withdrawal' : '/planification-retrait-dynamique',
          planLevel: 'professional'
        },
        {
          id: 'inflation-protection',
          label: isEnglish ? 'Inflation Protection' : 'Protection Inflation',
          path: '/centre-protection-inflation',
          planLevel: 'professional'
        },
        {
          id: 'spending-psychology',
          label: isEnglish ? 'Spending Psychology' : 'Psychologie des Dépenses',
          path: isEnglish ? '/spending-psychology' : '/psychologie-depenses',
          planLevel: 'professional'
        },
        {
          id: 'progressive-retirement',
          label: isEnglish ? 'Progressive Retirement' : 'Retraite Progressive',
          path: isEnglish ? '/progressive-retirement' : '/retraite-progressive',
          planLevel: 'professional'
        },
        {
          id: 'rvdaa',
          label: 'RVDAA',
          path: '/rvdaa',
          planLevel: 'professional'
        },
        {
          id: 'withdrawal-sequence',
          label: isEnglish ? 'Withdrawal Sequence' : 'Séquence de Retrait',
          path: isEnglish ? '/withdrawal-sequence' : '/sequence-retrait',
          planLevel: 'professional'
        },
        {
          id: 'rrsp-meltdown',
          label: isEnglish ? 'RRSP Meltdown Strategies' : 'Stratégies REER Meltdown',
          path: isEnglish ? '/rrsp-meltdown' : '/strategies-reer-meltdown',
          planLevel: 'professional'
        },
        {
          id: 'cash-wedge-bucket',
          label: isEnglish ? 'Cash Wedge Strategy' : 'Stratégie Coussin Liquidités',
          path: '/module-coussin-liquidites',
          planLevel: 'professional'
        },

        // 🟣 OUTILS EXPERTS
        {
          id: 'expert-tools-header',
          label: isEnglish ? '🟣 EXPERT TOOLS' : '🟣 OUTILS EXPERTS',
          isHeader: true
        },
        {
          id: 'succession',
          label: isEnglish ? 'Succession Planning' : 'Planification successorale',
          path: isEnglish ? '/succession-planning' : '/planification-successorale',
          planLevel: 'expert'
        }
      ]
    },
    {
      id: 'blog',
      label: isEnglish ? 'Blog' : 'Blog',
      icon: FileText,
      path: isEnglish ? '/en/blog' : '/blog',
      hasSubmenu: false
    },
    {
      id: 'reports',
      label: isEnglish ? 'Reports' : 'Rapports',
      icon: FileText,
      path: isEnglish ? '/en/retirement-reports' : '/fr/rapports-retraite',
      hasSubmenu: false
    },
    {
      id: 'save-load',
      label: isEnglish ? 'Save/Load' : 'Sauvegarder/Charger',
      icon: Database,
      path: isEnglish ? '/en/save-load' : '/fr/sauvegarder-charger',
      hasSubmenu: false
    }
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
    setOpenSubmenu(null);
  };

  const handleMenuClick = (item: any) => {
    if (item.hasSubmenu && item.path) {
      handleNavigation(item.path);
    } else if (item.hasSubmenu) {
      toggleSubmenu(item.id);
    } else {
      handleNavigation(item.path);
    }
  };

  const handleSubmenuClick = (path: string) => {
    handleNavigation(path);
    setOpenSubmenu(null);
  };

  const toggleSubmenu = (menuId: string) => {
    setOpenSubmenu(openSubmenu === menuId ? null : menuId);
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

  const isActivePath = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  // Couleurs des niveaux de plan — alignées avec la palette MPR
  const planLevelColors = {
    free:         'hover:bg-green-50 hover:text-green-700 border-l-2 border-l-green-500',
    professional: 'hover:bg-mpr-interactive-lt hover:text-mpr-navy border-l-2 border-l-mpr-interactive',
    expert:       'hover:bg-purple-50 hover:text-purple-700 border-l-2 border-l-purple-500'
  };

  const planLevelColorsMobile = {
    free:         'hover:bg-green-50 hover:text-green-700 border-l-4 border-l-green-500',
    professional: 'hover:bg-mpr-interactive-lt hover:text-mpr-navy border-l-4 border-l-mpr-interactive',
    expert:       'hover:bg-purple-50 hover:text-purple-700 border-l-4 border-l-purple-500'
  };

  return (
    <header className="bg-white shadow-md border-b-2 border-mpr-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14">
          {/* Logo */}
          <div className="flex items-center">
            <button
              onClick={() => handleNavigation(isEnglish ? '/en' : '/fr')}
              className="flex items-center hover:opacity-80 transition-opacity"
            >
              <img
                src="/logo-planretraite.png"
                alt="MonPlanRetraite.ca Logo"
                className="h-9 w-auto"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-0.5 submenu-container header-nav-compact">
            {navigationItems.map((item) => (
              <div key={item.id} className="relative submenu-container mr-0">
                <button
                  onClick={() => handleMenuClick(item)}
                  className={`flex items-center space-x-0.5 px-2 py-1.5 rounded-md text-xs font-medium transition-colors duration-200 ${
                    isActivePath(item.path)
                      ? 'bg-mpr-interactive-lt text-mpr-navy font-semibold shadow-sm'
                      : 'text-mpr-text-muted hover:text-mpr-navy hover:bg-mpr-interactive-lt'
                  }`}
                >
                  <item.icon className="w-3 h-3 flex-shrink-0" />
                  <span className="whitespace-nowrap text-xs">{item.label}</span>
                  {item.hasSubmenu && (
                    <ChevronDown className={`w-3 h-3 flex-shrink-0 transition-transform ${openSubmenu === item.id ? 'rotate-180' : ''}`} />
                  )}
                </button>

                {/* Sous-menu déroulant */}
                {item.hasSubmenu && openSubmenu === item.id && (
                  <div className="absolute top-full left-0 mt-0.5 w-72 bg-white border border-mpr-border rounded-lg shadow-lg z-[9999] max-h-96 overflow-y-auto">
                    {item.submenu?.map((subItem, index) => {
                      if (subItem.isHeader) {
                        return (
                          <div
                            key={subItem.id}
                            className={`px-3 py-1.5 text-xs font-bold text-mpr-text-muted bg-mpr-bg-section border-b border-mpr-border ${
                              index === 0 ? 'rounded-t-lg' : ''
                            }`}
                          >
                            {subItem.label}
                          </div>
                        );
                      }

                      const planLevelColor = subItem.planLevel
                        ? planLevelColors[subItem.planLevel as keyof typeof planLevelColors]
                        : 'hover:bg-gray-50 hover:text-gray-700';

                      return (
                        <button
                          key={subItem.id}
                          onClick={() => handleSubmenuClick(subItem.path)}
                          className={`w-full text-left px-3 py-1.5 text-sm text-mpr-text transition-colors ${planLevelColor} ${
                            index === item.submenu.length - 1 ? 'rounded-b-lg' : ''
                          }`}
                        >
                          {subItem.label}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Language Selector & Mobile Menu Button */}
          <div className="flex items-center space-x-3">
            <div className="block">
              <LanguageSelector isEnglish={isEnglish} />
            </div>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-mpr-text-muted hover:text-mpr-navy hover:bg-mpr-interactive-lt transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-mpr-border py-2">
            <div className="space-y-1">
              {navigationItems.map((item) => (
                <div key={item.id}>
                  <button
                    onClick={() => handleMenuClick(item)}
                    className={`flex items-center justify-between w-full px-4 py-2 rounded-lg text-left transition-all duration-200 ${
                      isActivePath(item.path)
                        ? 'bg-mpr-interactive-lt text-mpr-navy font-semibold'
                        : 'text-mpr-text-muted hover:text-mpr-navy hover:bg-mpr-interactive-lt'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <item.icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </div>
                    {item.hasSubmenu && (
                      <ChevronDown className={`w-4 h-4 transition-transform ${openSubmenu === item.id ? 'rotate-180' : ''}`} />
                    )}
                  </button>

                  {/* Sous-menu mobile */}
                  {item.hasSubmenu && openSubmenu === item.id && (
                    <div className="ml-4 mt-1 space-y-0.5 max-h-80 overflow-y-auto">
                      {item.submenu?.map((subItem) => {
                        if (subItem.isHeader) {
                          return (
                            <div
                              key={subItem.id}
                              className="px-3 py-1.5 text-xs font-bold text-mpr-text-muted bg-mpr-bg-section rounded-lg border border-mpr-border"
                            >
                              {subItem.label}
                            </div>
                          );
                        }

                        const planLevelColor = subItem.planLevel
                          ? planLevelColorsMobile[subItem.planLevel as keyof typeof planLevelColorsMobile]
                          : 'hover:bg-gray-50 hover:text-gray-700';

                        return (
                          <button
                            key={subItem.id}
                            onClick={() => handleSubmenuClick(subItem.path)}
                            className={`w-full text-left px-3 py-1.5 text-sm text-mpr-text rounded-lg transition-colors ${planLevelColor}`}
                          >
                            {subItem.label}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default UniformHeader;
