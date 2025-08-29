import React from 'react';
import { Phase2Wrapper } from '../../features/retirement/components/Phase2Wrapper';
import { SimpleNavigation } from '../layout/header/SimpleNavigation';
import { useLanguage } from '../../features/retirement/hooks/useLanguage';

interface UnifiedRetirementEntryProps {
  className?: string;
}

const UnifiedRetirementEntry: React.FC<UnifiedRetirementEntryProps> = ({ 
  className = "" 
}) => {
  const { language } = useLanguage();
  const isFrench = language === 'fr';

  // Translations object for better maintainability
  const t = {
    title: isFrench ? 'Planificateur de retraite' : 'Retirement Planner',
    subtitle: isFrench 
      ? 'Planifiez votre retraite avec des outils professionnels et des analyses avancées'
      : 'Plan your retirement with professional tools and advanced analysis',
    
    // Section titles
    completePlanning: isFrench ? 'Planification financière complète' : 'Complete Financial Planning',
    planningDescription: isFrench
      ? 'Notre plateforme unique vous permet de gérer l\'ensemble de votre planification financière, budgétaire et fiscale pour une retraite sereine et optimisée.'
      : 'Our unique platform allows you to manage your entire financial, budgetary and tax planning for a serene and optimized retirement.',
    
    // Feature cards
    cashflowTitle: isFrench ? 'Gestion du flux de trésorerie (cashflow)' : 'Cashflow Management',
    cashflowDesc: isFrench 
      ? 'Analysez vos revenus et dépenses mois par mois, identifiez les opportunités d\'économies et optimisez votre budget pour maximiser votre épargne-retraite.'
      : 'Analyze and optimize your expense flows to maximize your savings',
    
    withdrawalTitle: isFrench ? 'Stratégies de décaissement' : 'Withdrawal Strategies',
    withdrawalDesc: isFrench
      ? 'Découvrez les stratégies de décaissement les plus avantageuses pour vos REER, FERR, CELI et autres placements.'
      : 'Determine the best time to withdraw from your investments',
    
    expenseTitle: isFrench ? 'Planification des dépenses' : 'Expense Planning',
    expenseDesc: isFrench
      ? 'Modélisez l\'impact financier de vos projets majeurs sur votre retraite.'
      : 'Evaluate the impact of major purchases on your future income',
    
    taxTitle: isFrench ? 'Optimisation fiscale' : 'Tax Optimization',
    taxDesc: isFrench
      ? 'Exploitez toutes les opportunités fiscales disponibles grâce à des stratégies avancées.'
      : 'Minimize your taxes with smart withdrawal strategies',
    
    // Plan comparison
    planComparison: isFrench ? 'Comparaison des plans' : 'Plan Comparison',
    planComparisonDesc: isFrench
      ? 'Découvrez ce qui est inclus dans chaque plan et choisissez celui qui correspond à vos besoins'
      : 'Discover what\'s included in each plan and choose the one that fits your needs',
    
    // Plans
    free: isFrench ? 'Gratuit' : 'Free',
    professional: isFrench ? 'Professionnel' : 'Professional',
    expert: isFrench ? 'Expert' : 'Expert',
    
    // Buttons
    startFree: isFrench ? 'Commencer gratuitement' : 'Start Free',
    chooseProfessional: isFrench ? 'Choisir Professionnel' : 'Choose Professional',
    chooseExpert: isFrench ? 'Choisir Expert' : 'Choose Expert',
    
    // Warning
    warningTitle: isFrench ? 'Avertissement important' : 'Important Warning',
    warningText: isFrench
      ? 'Cette plateforme de planification financière est un outil éducatif et informatif qui ne remplace en aucun cas une consultation avec un professionnel qualifié.'
      : 'This financial planning platform is an educational and informational tool that does not replace consultation with a qualified professional.',
    
    // Welcome
    welcome: isFrench ? 'Bienvenue Gerald Dore !' : 'Welcome Gerald Dore!',
    promoText: isFrench 
      ? 'Avez-vous un code promo ? Débloquez des fonctionnalités supplémentaires !'
      : 'Do you have a promo code? Unlock additional features!',
    promoPlaceholder: isFrench ? 'Entrez votre code promo....' : 'Enter your promo code....',
    apply: isFrench ? 'Appliquer' : 'Apply'
  };

  return (
    <Phase2Wrapper 
      theme="premium" 
      showParticles={true} 
      showPhysics={true}
      enableThemeRotation={true}
      enableAdaptiveLayout={true}
      className={className}
    >
      <SimpleNavigation />
      
      {/* Hero Section with premium theme */}
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white">
        <div className="container mx-auto px-6 py-16">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 drop-shadow-lg">
              {t.title}
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto drop-shadow-md">
              {t.subtitle}
            </p>
          </div>

          {/* Complete Financial Planning Section */}
          <div className="bg-white rounded-2xl p-8 md:p-12 mb-16 shadow-2xl">
            <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-6 text-center">
              {t.completePlanning}
            </h2>
            <p className="text-lg text-gray-700 text-center mb-8 max-w-4xl mx-auto">
              {t.planningDescription}
            </p>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Cashflow Management */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200 hover:shadow-lg transition-all duration-300">
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-blue-900 mb-2 text-center">
                  {t.cashflowTitle}
                </h3>
                <p className="text-blue-700 text-center text-sm">
                  {t.cashflowDesc}
                </p>
              </div>

              {/* Withdrawal Strategies */}
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200 hover:shadow-lg transition-all duration-300">
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-green-900 mb-2 text-center">
                  {t.withdrawalTitle}
                </h3>
                <p className="text-green-700 text-center text-sm">
                  {t.withdrawalDesc}
                </p>
              </div>

              {/* Expense Planning */}
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200 hover:shadow-lg transition-all duration-300">
                <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-purple-900 mb-2 text-center">
                  {t.expenseTitle}
                </h3>
                <p className="text-purple-700 text-center text-sm">
                  {t.expenseDesc}
                </p>
              </div>

              {/* Tax Optimization */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200 hover:shadow-lg transition-all duration-300">
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-blue-900 mb-2 text-center">
                  {t.taxTitle}
                </h3>
                <p className="text-blue-700 text-center text-sm">
                  {t.taxDesc}
                </p>
              </div>
            </div>
          </div>

          {/* Welcome and Promo Code Section */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-8 md:p-12 shadow-2xl">
            <div className="text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-green-600">M</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                {t.welcome}
              </h2>
              <p className="text-green-100 text-lg mb-8">
                {t.promoText}
              </p>
              
              <div className="max-w-md mx-auto">
                <div className="flex gap-4">
                  <input
                    type="text"
                    placeholder={t.promoPlaceholder}
                    className="flex-1 px-4 py-3 rounded-lg border-0 focus:ring-2 focus:ring-white focus:ring-opacity-50 text-gray-900"
                  />
                  <button className="bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors">
                    {t.apply}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Phase2Wrapper>
  );
};

export default UnifiedRetirementEntry;
