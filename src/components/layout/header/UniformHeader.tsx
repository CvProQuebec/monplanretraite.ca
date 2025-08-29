import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Menu, 
  X, 
  Home, 
  Calculator, 
  FileText, 
  User, 
  Settings,
  Globe,
  ChevronDown,
  Database,
  TrendingUp,
  DollarSign,
  BarChart3,
  AlertTriangle,
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

  // Navigation items avec sous-menus - RESTRUCTURÉ et CONSOLIDÉ
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
      hasSubmenu: true,
      submenu: [
        // 🟢 OUTILS GRATUITS (ordre alphabétique)
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
        
        // 🔵 OUTILS PROFESSIONNELS (ordre alphabétique)
        {
          id: 'professional-tools-header',
          label: isEnglish ? '🔵 PROFESSIONAL TOOLS' : '🔵 OUTILS PROFESSIONNELS',
          isHeader: true
        },
        {
          id: 'advanced-performance',
          label: isEnglish ? 'Advanced Performance Calculator' : 'Calculette de Rendement Avancée',
          path: isEnglish ? '/advanced-performance-calculator' : '/calculette-rendement-avancee',
          planLevel: 'professional'
        },
        {
          id: 'four-percent-rule',
          label: isEnglish ? '4% Rule Analysis' : 'Analyse Règle 4%',
          path: '/module-regle-4-pourcent',
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
        
        // 🟣 OUTILS EXPERTS (ordre alphabétique)
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
      hasSubmenu: true,
      submenu: [
        {
          id: 'blog-guides',
          label: isEnglish ? '📚 Practical Guides' : '📚 Guides Pratiques',
          path: isEnglish ? '/blog/guides' : '/blog/guides'
        },
        {
          id: 'blog-expert-tips',
          label: isEnglish ? '💡 Expert Tips' : '💡 Conseils d\'Experts',
          path: isEnglish ? '/blog/expert-tips' : '/blog/conseils-experts'
        },
        {
          id: 'blog-case-studies',
          label: isEnglish ? '📊 Case Studies' : '📊 Études de Cas',
          path: isEnglish ? '/blog/case-studies' : '/blog/etudes-cas'
        },
        {
          id: 'blog-tax-news',
          label: isEnglish ? '🔍 Tax News' : '🔍 Actualités Fiscales',
          path: isEnglish ? '/blog/tax-news' : '/blog/actualites-fiscales'
        }
      ]
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

  const handleNavigation = (path: string, action?: string) => {
    // Navigation directe vers la page
    navigate(path);
    setIsMobileMenuOpen(false);
    setOpenSubmenu(null);
  };

  const handleMenuClick = (item: any) => {
    if (item.hasSubmenu && item.path) {
      // Pour les menus avec sous-menu ET path (comme Dépenses), naviguer directement
      handleNavigation(item.path);
    } else if (item.hasSubmenu) {
      // Pour les menus avec sous-menu seulement, toggle le sous-menu
      toggleSubmenu(item.id);
    } else {
      // Pour les menus simples, naviguer directement
      handleNavigation(item.path);
    }
  };

  const handleSubmenuClick = (path: string) => {
    handleNavigation(path);
    setOpenSubmenu(null); // Close submenu after clicking
  };

  const toggleSubmenu = (menuId: string) => {
    setOpenSubmenu(openSubmenu === menuId ? null : menuId);
  };

  // Fermer les sous-menus lors du clic à l'extérieur
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

  return (
    <header className="bg-white shadow-lg border-b-2 border-blue-100 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <button
              onClick={() => handleNavigation(isEnglish ? '/en' : '/fr')}
              className="flex items-center hover:opacity-80 transition-opacity"
            >
              <img 
                src="/logo-planretraite.png" 
                alt="MonPlanRetraite.ca Logo" 
                className="h-8 w-auto"
                onError={(e) => {
                  console.error('Logo failed to load:', e);
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const fallback = target.nextElementSibling as HTMLElement;
                  if (fallback) fallback.style.display = 'block';
                }}
              />
              <div className="hidden text-lg font-bold text-blue-600">
                MonPlanRetraite.ca
              </div>
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-0.5 submenu-container">
            {navigationItems.map((item) => (
              <div key={item.id} className="relative submenu-container">
                <button
                  onClick={() => handleMenuClick(item)}
                  className={`flex items-center space-x-1.5 px-2.5 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                    isActivePath(item.path)
                      ? 'bg-blue-100 text-blue-700 shadow-sm'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  <item.icon className="w-3.5 h-3.5" />
                  <span className="whitespace-nowrap">{item.label}</span>
                  {item.hasSubmenu && (
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${openSubmenu === item.id ? 'rotate-180' : ''}`} />
                  )}
                </button>
                
                {/* Sous-menu déroulant */}
                {item.hasSubmenu && openSubmenu === item.id && (
                  <div className="absolute top-full left-0 mt-1 w-72 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
                    {item.submenu?.map((subItem, index) => {
                      if (subItem.isHeader) {
                        return (
                          <div
                            key={subItem.id}
                            className={`px-4 py-2 text-xs font-bold text-gray-500 bg-gray-50 border-b border-gray-100 ${
                              index === 0 ? 'rounded-t-lg' : ''
                            }`}
                          >
                            {subItem.label}
                          </div>
                        );
                      }
                      
                      const planLevelColors = {
                        free: 'hover:bg-green-50 hover:text-green-700 border-l-2 border-l-green-400',
                        professional: 'hover:bg-blue-50 hover:text-blue-700 border-l-2 border-l-blue-400',
                        expert: 'hover:bg-purple-50 hover:text-purple-700 border-l-2 border-l-purple-400'
                      };
                      
                      const planLevelColor = subItem.planLevel ? planLevelColors[subItem.planLevel] : 'hover:bg-gray-50 hover:text-gray-700';
                      
                      return (
                        <button
                          key={subItem.id}
                          onClick={() => handleSubmenuClick(subItem.path)}
                          className={`w-full text-left px-4 py-2.5 text-sm text-gray-700 transition-colors ${planLevelColor} ${
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
            {/* Language Selector - Visible on all screen sizes */}
            <div className="block">
              <LanguageSelector isEnglish={isEnglish} />
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
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
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="space-y-2">
              {navigationItems.map((item) => (
                <div key={item.id}>
                  <button
                    onClick={() => handleMenuClick(item)}
                    className={`flex items-center justify-between w-full px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                      isActivePath(item.path)
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
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
                    <div className="ml-4 mt-2 space-y-1 max-h-80 overflow-y-auto">
                      {item.submenu?.map((subItem) => {
                        if (subItem.isHeader) {
                          return (
                            <div
                              key={subItem.id}
                              className="px-4 py-2 text-xs font-bold text-gray-500 bg-gray-50 rounded-lg border border-gray-200"
                            >
                              {subItem.label}
                            </div>
                          );
                        }
                        
                        const planLevelColors = {
                          free: 'hover:bg-green-50 hover:text-green-700 border-l-4 border-l-green-400',
                          professional: 'hover:bg-blue-50 hover:text-blue-700 border-l-4 border-l-blue-400',
                          expert: 'hover:bg-purple-50 hover:text-purple-700 border-l-4 border-l-purple-400'
                        };
                        
                        const planLevelColor = subItem.planLevel ? planLevelColors[subItem.planLevel] : 'hover:bg-gray-50 hover:text-gray-700';
                        
                        return (
                          <button
                            key={subItem.id}
                            onClick={() => handleSubmenuClick(subItem.path)}
                            className={`w-full text-left px-4 py-2.5 text-sm text-gray-600 rounded-lg transition-colors ${planLevelColor}`}
                          >
                            {subItem.label}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
              
              {/* Mobile Language Selector */}
              <div className="px-4 py-3 border-t border-gray-200 mt-4 sm:hidden">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    {isEnglish ? 'Language' : 'Langue'}
                  </span>
                  <LanguageSelector isEnglish={isEnglish} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default UniformHeader;
