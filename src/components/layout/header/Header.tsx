// Header MonPlanRetraite - Navigation intégrée
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/features/retirement/hooks/useLanguage';
import { translations } from '@/features/retirement/translations/index';
import { useAuth } from '@/hooks/useAuth';
import { 
  BarChart3, 
  Users, 
  Shield, 
  DollarSign, 
  TrendingUp, 
  Calendar,
  Calculator, 
  Zap, 
  FileText,
  Download,
  Flag,
  Crown,
  AlertTriangle,
  ExternalLink,
  Database,
  Lock,
  Menu,
  X
} from 'lucide-react';

export const Header: React.FC = () => {
  const { language } = useLanguage();
  const t = translations[language];
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Sections regroupées par catégorie
  const sectionGroups = [
    {
      title: language === 'fr' ? 'Outils' : 'Tools',
      sections: [
        { id: 'dashboard', label: t.navigation.dashboard, icon: BarChart3, requiredPlan: 'free' },
        { id: 'personal', label: t.navigation.profile, icon: Users, requiredPlan: 'free' },
        { id: 'retirement', label: t.navigation.retirement, icon: Shield, requiredPlan: 'free' },
        { id: 'savings', label: t.navigation.savings, icon: DollarSign, requiredPlan: 'free' },
        // Modules de calcul déplacés des "Modules Avancés"
        { id: 'cashflow', label: t.navigation.cashflow, icon: TrendingUp, requiredPlan: 'professional' },
        { id: 'cpp', label: 'CPP', icon: Flag, requiredPlan: 'professional' },
        { id: 'combined-pension', label: 'CPP+RRQ', icon: BarChart3, requiredPlan: 'professional' },
        { id: 'advanced-expenses', label: t.navigation.advancedExpenses, icon: Calendar, requiredPlan: 'professional' },
        { id: 'tax', label: t.navigation.taxOptimization, icon: Calculator, requiredPlan: 'professional' },
        { id: 'simulator', label: t.navigation.simulator, icon: Zap, requiredPlan: 'professional' },
        // Calculette de rendement avancée ajoutée
        { id: 'advanced-performance', label: language === 'fr' ? 'Calculette de rendement avancée' : 'Advanced Performance Calculator', icon: Calculator, requiredPlan: 'professional' },
        // Modules avec formulaires de calcul
        { id: 'ferr-optimization', label: language === 'fr' ? 'Optimisation FERR' : 'RRIF Optimization', icon: Calculator, requiredPlan: 'professional' },
        { id: 'celiapp', label: 'CELIAPP', icon: Calculator, requiredPlan: 'free' },
        { id: 'withdrawal-sequence', label: language === 'fr' ? 'Séquence de Retrait' : 'Withdrawal Sequence', icon: Calculator, requiredPlan: 'expert' },
        { id: 'healthcare-cost', label: language === 'fr' ? 'Coûts de Santé' : 'Healthcare Costs', icon: Calculator, requiredPlan: 'professional' },
        { id: 'tax-optimization', label: language === 'fr' ? 'Optimisation Fiscale Multi-Sources' : 'Multi-Source Tax Optimization', icon: Calculator, requiredPlan: 'expert' },
        { id: 'longevity-planning', label: language === 'fr' ? 'Planification Longévité' : 'Longevity Planning', icon: Calculator, requiredPlan: 'professional' },
        { id: 'consolidation', label: language === 'fr' ? 'Consolidation Financière' : 'Financial Consolidation', icon: Calculator, requiredPlan: 'professional' },
        { id: 'progressive-retirement', label: language === 'fr' ? 'Retraite Progressive' : 'Progressive Retirement', icon: Calculator, requiredPlan: 'professional' },
        { id: 'inflation-protection', label: language === 'fr' ? 'Protection Inflation' : 'Inflation Protection', icon: Calculator, requiredPlan: 'professional' },
        { id: 'rrsp-meltdown', label: language === 'fr' ? 'Stratégies REER Meltdown' : 'RRSP Meltdown Strategies', icon: Calculator, requiredPlan: 'expert' },
        { id: 'cpp-timing', label: language === 'fr' ? 'Optimisation Timing CPP' : 'CPP Timing Optimization', icon: Calculator, requiredPlan: 'professional' },
        { id: 'spending-psychology', label: language === 'fr' ? 'Psychologie des Dépenses' : 'Spending Psychology', icon: Calculator, requiredPlan: 'professional' },
        { id: 'dynamic-withdrawal', label: language === 'fr' ? 'Planification Retrait Dynamique' : 'Dynamic Withdrawal Planning', icon: Calculator, requiredPlan: 'expert' },
        { id: 'four-percent-rule', label: language === 'fr' ? 'Règle des 4 %' : '4% Rule', icon: Calculator, requiredPlan: 'free' },
        { id: 'rvdaa', label: 'RVDAA', icon: Calculator, requiredPlan: 'expert' },
      ]
    },
    {
      title: language === 'fr' ? 'Modules Éducatifs' : 'Educational Modules',
      sections: [
        { id: 'government-education', label: language === 'fr' ? 'Centre d\'Éducation Gouvernementale' : 'Government Education Center', icon: Shield, requiredPlan: 'free' },
      ]
    },
    {
      title: language === 'fr' ? 'Sauvegarde et sécurité' : 'Backup & Security',
      sections: [
        { id: 'session', label: language === 'fr' ? 'Sauvegarder/Charger' : 'Save/Load', icon: Database, requiredPlan: 'free' },
        { id: 'backup-security', label: language === 'fr' ? 'Conseils de sécurité' : 'Security Tips', icon: Lock, requiredPlan: 'free', external: true },
      ]
    },
    {
      title: language === 'fr' ? 'Rapports et analyses' : 'Reports & Analysis',
      sections: [
        { id: 'reports', label: t.navigation.reports, icon: FileText, requiredPlan: 'professional', external: true },
        { id: 'emergency-info', label: language === 'fr' ? 'Informations d\'urgence' : 'Emergency Info', icon: AlertTriangle, requiredPlan: 'free' },
      ]
    },
    {
      title: language === 'fr' ? 'Fonctionnalités premium' : 'Premium Features',
      sections: [
        { id: 'premium-features', label: language === 'fr' ? 'Premium' : 'Premium', icon: Crown, requiredPlan: 'ultimate' },
      ]
    },
    {
      title: language === 'fr' ? 'Démonstrations' : 'Demos',
      sections: [
        { id: 'demos', label: language === 'fr' ? 'Voir les démos' : 'View Demos', icon: Zap, requiredPlan: 'free', external: true },
      ]
    }
  ];

  const handleSectionClick = (section: any) => {
    if (section.external) {
      // Navigation vers les pages externes
      let externalPath = '';
      if (section.id === 'backup-security') {
        externalPath = language === 'fr' 
          ? `/fr/sauvegarde-securite` 
          : `/en/backup-security`;
      } else if (section.id === 'reports') {
        externalPath = language === 'fr' 
          ? `/fr/rapports-retraite` 
          : `/en/retirement-reports`;
      } else if (section.id === 'demos') {
        externalPath = language === 'fr' 
          ? `/fr/demos` 
          : `/en/demos`;
      }
      navigate(externalPath);
    } else {
      // Section normale du module
      navigate(`/fr/retraite-module?section=${section.id}`);
    }
    setIsMobileMenuOpen(false);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Erreur de déconnexion:', error);
    }
  };

  return (
    <header className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 border-b-4 border-blue-400 shadow-2xl">
      <div className="container mx-auto px-6">
        <div className="py-6 space-y-6">
          {/* Titre principal */}
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <img 
                src="/logo-monplanretraite.png" 
                alt="MonPlanRetraite.ca Logo" 
                className="h-16 w-auto mr-4"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.nextElementSibling?.classList.remove('hidden');
                }}
              />
              <div className="hidden text-2xl font-bold text-white bg-blue-600 px-4 py-2 rounded-lg">
                MonPlanRetraite.ca
              </div>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2 drop-shadow-lg">
              {language === 'fr' ? 'MonPlanRetraite.ca' : 'MonPlanRetraite.ca'}
            </h1>
            <p className="text-blue-100 text-lg">
              {language === 'fr' 
                ? 'Planifiez votre avenir financier avec nos outils professionnels'
                : 'Plan your financial future with our professional tools'
              }
            </p>
          </div>

          {/* Navigation par groupes */}
          <div className="hidden md:block space-y-4">
            {sectionGroups.map((group, groupIndex) => (
              <div key={groupIndex} className="space-y-3">
                <h3 className="text-sm font-bold text-blue-100 uppercase tracking-wide px-2 bg-blue-500/30 rounded-lg py-1 inline-block">
                  {group.title}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {group.sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => handleSectionClick(section)}
                      className="flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 hover:scale-105 shadow-lg bg-white/90 text-gray-700 border-2 border-white/50 hover:bg-white hover:border-blue-300 hover:shadow-xl"
                    >
                      <section.icon className="w-4 h-4" />
                      {section.label}
                      {section.external && <ExternalLink className="w-3 h-3" />}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Menu mobile */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white p-2"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            
            {isMobileMenuOpen && (
              <div className="mt-4 bg-white/95 rounded-lg p-4 space-y-4 max-h-96 overflow-y-auto">
                {sectionGroups.map((group, groupIndex) => (
                  <div key={groupIndex} className="space-y-2">
                    <h3 className="text-sm font-bold text-blue-600 uppercase tracking-wide">
                      {group.title}
                    </h3>
                    <div className="space-y-2">
                      {group.sections.map((section) => (
                        <button
                          key={section.id}
                          onClick={() => handleSectionClick(section)}
                          className="w-full text-left px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-50 transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <section.icon className="w-4 h-4" />
                            <span>{section.label}</span>
                            {section.external && <ExternalLink className="w-3 h-3" />}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Indicateur de plan actuel et utilisateur */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm font-bold border-2 border-white/30 shadow-lg">
              <Shield className="w-5 h-5" />
              {language === 'fr' ? 'Plan actuel : Gratuit' : 'Current plan: Free'}
            </div>
            
            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-white font-medium">
                  {language === 'fr' ? 'Bonjour' : 'Hello'} {user.displayName || user.email}
                </span>
                <button
                  onClick={handleSignOut}
                  className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors"
                >
                  {language === 'fr' ? 'Déconnexion' : 'Sign Out'}
                </button>
              </div>
            ) : (
              <button
                onClick={() => navigate('/')}
                className="px-6 py-3 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors"
              >
                {language === 'fr' ? 'Se connecter' : 'Sign In'}
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;