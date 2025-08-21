import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '@/features/retirement/hooks/useLanguage';
import { 
  Home, 
  User, 
  DollarSign, 
  BarChart3, 
  Settings,
  Phone,
  HelpCircle,
  Shield,
  Menu,
  X,
  ChevronDown,
  ChevronRight
} from 'lucide-react';

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  path: string;
  description: string;
  subItems?: {
    id: string;
    label: string;
    path: string;
    description: string;
  }[];
}

export const SeniorsNavigationHeader: React.FC = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  // Configuration de la navigation simplifiée pour seniors avec regroupement thématique
  const navigationItems: NavigationItem[] = [
    {
      id: 'home',
      label: language === 'fr' ? 'ACCUEIL' : 'HOME',
      icon: Home,
      path: '/',
      description: language === 'fr' ? 'Vue d\'ensemble et progression' : 'Overview and progress',
      subItems: [
        {
          id: 'dashboard',
          label: language === 'fr' ? 'Mon tableau de bord' : 'My dashboard',
          path: '/',
          description: language === 'fr' ? 'Voir ma progression générale' : 'View my overall progress'
        },
        {
          id: 'next-steps',
          label: language === 'fr' ? 'Prochaines étapes' : 'Next steps',
          path: '/mes-resultats',
          description: language === 'fr' ? 'Ce que je dois faire ensuite' : 'What I need to do next'
        },
        {
          id: 'help',
          label: language === 'fr' ? 'Aide et support' : 'Help and support',
          path: '/',
          description: language === 'fr' ? 'Obtenir de l\'aide rapidement' : 'Get help quickly'
        }
      ]
    },
    {
      id: 'profile',
      label: language === 'fr' ? 'MON PROFIL' : 'MY PROFILE',
      icon: User,
      path: '/mon-profil',
      description: language === 'fr' ? 'Mes informations et objectifs' : 'My information and goals',
      subItems: [
        {
          id: 'personal-info',
          label: language === 'fr' ? 'Informations personnelles' : 'Personal information',
          path: '/mon-profil',
          description: language === 'fr' ? 'Âge, famille, santé, résidence' : 'Age, family, health, residence'
        },
        {
          id: 'retirement-goals',
          label: language === 'fr' ? 'Objectifs de retraite' : 'Retirement goals',
          path: '/mon-profil',
          description: language === 'fr' ? 'Âge souhaité, style de vie, projets' : 'Desired age, lifestyle, projects'
        },
        {
          id: 'emergency-contacts',
          label: language === 'fr' ? 'Contacts d\'urgence' : 'Emergency contacts',
          path: '/mon-profil',
          description: language === 'fr' ? 'Famille, médecin, notaire, directives' : 'Family, doctor, notary, directives'
        }
      ]
    },
    {
      id: 'retirement',
      label: language === 'fr' ? 'MA RETRAITE' : 'MY RETIREMENT',
      icon: DollarSign,
      path: '/ma-retraite',
      description: language === 'fr' ? 'Planifier avec mes ressources réelles' : 'Plan with my real resources',
      subItems: [
        {
          id: 'income-assets',
          label: language === 'fr' ? 'Mes revenus et actifs' : 'My income and assets',
          path: '/ma-retraite',
          description: language === 'fr' ? 'Salaire, pensions, épargne, immobilier' : 'Salary, pensions, savings, real estate'
        },
        {
          id: 'expenses-budget',
          label: language === 'fr' ? 'Mes dépenses et budget' : 'My expenses and budget',
          path: '/ma-retraite',
          description: language === 'fr' ? 'Logement, alimentation, transport, santé' : 'Housing, food, transportation, health'
        },
        {
          id: 'calculations',
          label: language === 'fr' ? 'Mes calculs de retraite' : 'My retirement calculations',
          path: '/ma-retraite',
          description: language === 'fr' ? 'Projections et planification' : 'Projections and planning'
        }
      ]
    },
    {
      id: 'results',
      label: language === 'fr' ? 'MES RÉSULTATS' : 'MY RESULTS',
      icon: BarChart3,
      path: '/mes-resultats',
      description: language === 'fr' ? 'Mon plan et mes progrès' : 'My plan and progress',
      subItems: [
        {
          id: 'retirement-score',
          label: language === 'fr' ? 'Mon score de retraite' : 'My retirement score',
          path: '/mes-resultats',
          description: language === 'fr' ? 'Évaluation de ma préparation' : 'Assessment of my preparation'
        },
        {
          id: 'personalized-plan',
          label: language === 'fr' ? 'Mon plan personnalisé' : 'My personalized plan',
          path: '/mes-resultats',
          description: language === 'fr' ? 'Recommandations adaptées à ma situation' : 'Recommendations adapted to my situation'
        },
        {
          id: 'progress-tracking',
          label: language === 'fr' ? 'Suivi de mes progrès' : 'Progress tracking',
          path: '/mes-resultats',
          description: language === 'fr' ? 'Voir mon évolution dans le temps' : 'See my evolution over time'
        }
      ]
    }
  ];

  // Menu avancé (optionnel)
  const advancedItems = [
    {
      id: 'cpp-detailed',
      label: language === 'fr' ? 'Calculs détaillés CPP/RRQ' : 'Detailed CPP/RRQ calculations',
      path: language === 'fr' ? '/fr/retraite-module?section=cpp' : '/en/retirement-module?section=cpp'
    },
    {
      id: 'tax-optimization',
      label: language === 'fr' ? 'Optimisation fiscale' : 'Tax optimization',
      path: language === 'fr' ? '/fr/retraite-module?section=tax' : '/en/retirement-module?section=tax'
    },
    {
      id: 'advanced-simulations',
      label: language === 'fr' ? 'Simulations avancées' : 'Advanced simulations',
      path: language === 'fr' ? '/fr/retraite-module?section=simulator' : '/en/retirement-module?section=simulator'
    }
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
    setExpandedSection(null);
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId);
  };

  const isCurrentPath = (path: string) => {
    return location.pathname === path || location.pathname.includes(path.split('?')[0]);
  };

  return (
    <header className="bg-white border-b-4 border-blue-500 shadow-lg seniors-mode">
      <div className="container mx-auto px-4">
        {/* En-tête principal */}
        <div className="py-6 text-center border-b border-gray-200">
          <div className="flex items-center justify-center mb-4">
            <img 
              src="/logo-planretraite.png" 
              alt="MonPlanRetraite.ca Logo" 
              className="h-16 w-auto mr-4"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            MonPlanRetraite.ca
          </h1>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto">
            {language === 'fr' 
              ? 'Planifiez votre retraite simplement et en toute confiance'
              : 'Plan your retirement simply and with confidence'
            }
          </p>
        </div>

        {/* Navigation principale - Desktop */}
        <nav className="hidden lg:block py-6">
          <div className="flex justify-center space-x-8">
            {navigationItems.map((item) => (
              <div key={item.id} className="relative group">
                <button
                  onClick={() => handleNavigation(item.path)}
                  className={`flex flex-col items-center p-6 rounded-xl transition-all duration-200 min-w-[180px] ${
                    isCurrentPath(item.path)
                      ? 'bg-blue-100 border-2 border-blue-500 text-blue-700 shadow-md'
                      : 'bg-gray-50 border-2 border-gray-200 text-gray-700 hover:bg-blue-50 hover:border-blue-300 hover:shadow-md'
                  }`}
                >
                  <item.icon className="w-8 h-8 mb-3" />
                  <span className="text-lg font-semibold mb-1">{item.label}</span>
                  <span className="text-sm text-center leading-tight">{item.description}</span>
                </button>

                {/* Sous-menu au survol */}
                {item.subItems && (
                  <div className="absolute top-full left-0 mt-2 w-80 bg-white border-2 border-gray-200 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3 border-b border-gray-200 pb-2">
                        {item.label}
                      </h3>
                      {item.subItems.map((subItem) => (
                        <button
                          key={subItem.id}
                          onClick={() => handleNavigation(subItem.path)}
                          className="w-full text-left p-3 rounded-lg hover:bg-blue-50 transition-colors duration-150 mb-2 last:mb-0"
                        >
                          <div className="font-medium text-gray-900 mb-1">{subItem.label}</div>
                          <div className="text-sm text-gray-600">{subItem.description}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </nav>

        {/* Navigation mobile */}
        <div className="lg:hidden py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="flex items-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg font-medium"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              <span>{language === 'fr' ? 'Menu' : 'Menu'}</span>
            </button>

            <div className="flex items-center gap-3">
              <button 
                className="p-3 bg-green-100 text-green-700 rounded-lg"
                title={language === 'fr' ? 'Appelez-nous pour de l\'aide' : 'Call us for help'}
                aria-label={language === 'fr' ? 'Appelez-nous pour de l\'aide' : 'Call us for help'}
              >
                <Phone className="w-5 h-5" />
              </button>
              <button 
                className="p-3 bg-blue-100 text-blue-700 rounded-lg"
                title={language === 'fr' ? 'Obtenir de l\'aide' : 'Get help'}
                aria-label={language === 'fr' ? 'Obtenir de l\'aide' : 'Get help'}
              >
                <HelpCircle className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Menu mobile déployé */}
          {isMobileMenuOpen && (
            <div className="mt-4 bg-white border-2 border-gray-200 rounded-xl shadow-lg">
              {navigationItems.map((item) => (
                <div key={item.id} className="border-b border-gray-100 last:border-b-0">
                  <button
                    onClick={() => toggleSection(item.id)}
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="w-6 h-6 text-gray-600" />
                      <div>
                        <div className="font-semibold text-gray-900">{item.label}</div>
                        <div className="text-sm text-gray-600">{item.description}</div>
                      </div>
                    </div>
                    {item.subItems && (
                      expandedSection === item.id ? 
                        <ChevronDown className="w-5 h-5 text-gray-400" /> :
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                    )}
                  </button>

                  {/* Sous-éléments mobiles */}
                  {item.subItems && expandedSection === item.id && (
                    <div className="bg-gray-50 px-4 pb-4">
                      {item.subItems.map((subItem) => (
                        <button
                          key={subItem.id}
                          onClick={() => handleNavigation(subItem.path)}
                          className="w-full text-left p-3 rounded-lg hover:bg-white transition-colors duration-150 mb-2 last:mb-0"
                        >
                          <div className="font-medium text-gray-900 mb-1">{subItem.label}</div>
                          <div className="text-sm text-gray-600">{subItem.description}</div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Barre d'informations et d'aide */}
        <div className="py-4 border-t border-gray-200">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Indicateurs de sécurité et progression */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                <Shield className="w-4 h-4" />
                {language === 'fr' ? 'Données sécurisées' : 'Secure data'}
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                <BarChart3 className="w-4 h-4" />
                {language === 'fr' ? 'Progression : 35 %' : 'Progress: 35%'}
              </div>
            </div>

            {/* Boutons d'aide */}
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-800 rounded-lg font-medium hover:bg-orange-200 transition-colors">
                <Phone className="w-4 h-4" />
                <span className="hidden sm:inline">
                  {language === 'fr' ? 'Appelez-nous' : 'Call us'}
                </span>
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-800 rounded-lg font-medium hover:bg-purple-200 transition-colors">
                <HelpCircle className="w-4 h-4" />
                <span className="hidden sm:inline">
                  {language === 'fr' ? 'Aide' : 'Help'}
                </span>
              </button>
              <button
                onClick={() => setExpandedSection(expandedSection === 'advanced' ? null : 'advanced')}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-800 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                <Settings className="w-4 h-4" />
                <span className="hidden sm:inline">
                  {language === 'fr' ? 'Plus d\'options' : 'More options'}
                </span>
              </button>
            </div>
          </div>

          {/* Menu avancé déployable */}
          {expandedSection === 'advanced' && (
            <div className="mt-4 p-4 bg-gray-50 rounded-xl border-2 border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                {language === 'fr' ? '⚙️ fonctionnalités avancées' : '⚙️ Advanced features'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {advancedItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleNavigation(item.path)}
                    className="p-3 bg-white border border-gray-200 rounded-lg text-left hover:bg-blue-50 hover:border-blue-300 transition-colors"
                  >
                    <div className="font-medium text-gray-900">{item.label}</div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default SeniorsNavigationHeader;
