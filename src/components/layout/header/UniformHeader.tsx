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
          path: isEnglish ? '/srg-module' : '/module-srg'
        },
        {
          id: 'rregop-module',
          label: isEnglish ? 'RREGOP Module' : 'Module RREGOP',
          path: isEnglish ? '/rregop-module' : '/module-rregop'
        },
        {
          id: 'rrq-cpp',
          label: isEnglish ? 'RRQ/CPP Analysis' : 'Analyse RRQ/CPP',
          path: isEnglish ? '/rrq-cpp-analysis' : '/analyse-rrq-cpp'
        },
        {
          id: 'oas-gis',
          label: isEnglish ? 'OAS/GIS Analysis' : 'Analyse OAS/GIS',
          path: isEnglish ? '/oas-gis-analysis' : '/analyse-oas-gis'
        }
      ]
    },
    {
      id: 'assistant',
      label: isEnglish ? 'Financial Assistant' : 'Assistant financier',
      icon: Calculator,
      path: isEnglish ? '/financial-assistant' : '/assistant-financier',
      hasSubmenu: false
    },
    {
      id: 'planning',
      label: isEnglish ? 'Planning' : 'Planification',
      icon: AlertTriangle,
      hasSubmenu: true,
      submenu: [
        {
          id: 'emergency-info',
          label: isEnglish ? 'Emergency Planning' : 'Planification d\'urgence',
          path: isEnglish ? '/emergency-planning' : '/planification-urgence'
        },
        {
          id: 'succession',
          label: isEnglish ? 'Succession Planning' : 'Planification successorale',
          path: isEnglish ? '/succession-planning' : '/planification-successorale'
        },
        {
          id: 'expenses',
          label: isEnglish ? 'Expense Planning' : 'Planification de dépenses',
          path: isEnglish ? '/expense-planning' : '/planification-depenses'
        },
        {
          id: 'tax-optimization',
          label: isEnglish ? 'Tax Optimization' : 'Optimisation fiscale',
          path: isEnglish ? '/tax-optimization' : '/optimisation-fiscale'
        },
        {
          id: 'expert-planning',
          label: isEnglish ? 'Expert Planning' : 'Planification expert',
          path: isEnglish ? '/expert-planning' : '/planification-expert'
        }
      ]
    },
    {
      id: 'simulations',
      label: isEnglish ? 'Simulations' : 'Simulations',
      icon: BarChart3,
      hasSubmenu: true,
      submenu: [
        {
          id: 'monte-carlo',
          label: isEnglish ? 'Monte Carlo Simulator' : 'Simulateur Monte Carlo',
          path: isEnglish ? '/monte-carlo-simulator' : '/simulateur-monte-carlo'
        },
        {
          id: 'sensitivity-analysis',
          label: isEnglish ? 'Sensitivity Analysis' : 'Analyse de sensibilité',
          path: isEnglish ? '/sensitivity-analysis' : '/analyse-sensibilite'
        },
        {
          id: 'scenario-comparison',
          label: isEnglish ? 'Scenario Comparison' : 'Comparaison de scénarios',
          path: isEnglish ? '/scenario-comparison' : '/comparaison-scenarios'
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
              />
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1 submenu-container">
            {navigationItems.map((item) => (
              <div key={item.id} className="relative submenu-container">
                <button
                  onClick={() => handleMenuClick(item)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActivePath(item.path)
                      ? 'bg-blue-100 text-blue-700 shadow-sm'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                  {item.hasSubmenu && (
                    <ChevronDown className={`w-4 h-4 transition-transform ${openSubmenu === item.id ? 'rotate-180' : ''}`} />
                  )}
                </button>
                
                {/* Sous-menu déroulant */}
                {item.hasSubmenu && openSubmenu === item.id && (
                  <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                    {item.submenu?.map((subItem) => (
                      <button
                        key={subItem.id}
                        onClick={() => handleSubmenuClick(subItem.path)}
                        className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors first:rounded-t-lg last:rounded-b-lg"
                      >
                        {subItem.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Language Selector & Mobile Menu Button */}
          <div className="flex items-center space-x-3">
            {/* Language Selector */}
            <div className="hidden sm:block">
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
                    <div className="ml-8 mt-2 space-y-1">
                      {item.submenu?.map((subItem) => (
                        <button
                          key={subItem.id}
                          onClick={() => handleSubmenuClick(subItem.path)}
                          className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          {subItem.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              
              {/* Mobile Language Selector */}
              <div className="px-4 py-3 border-t border-gray-200 mt-4">
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
