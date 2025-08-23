import React, { useState } from 'react';
import { PLANS, PROMO_CODES, calculatePriceWithPromo, calculateAnnualSavings } from '@/config/plans';
import { useLanguage } from '../hooks/useLanguage';
import { Check, Star, Zap, Crown, Shield, Users, FileText, BarChart3, Brain, Settings } from 'lucide-react';

export const PricingSection: React.FC = () => {
  const { lang } = useLanguage();
  const [billingCycle, setBillingCycle] = useState<'month' | 'year'>('year');
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [promoError, setPromoError] = useState('');

  const t = {
    fr: {
      title: 'Choisissez votre plan de retraite',
      subtitle: 'Des outils puissants pour planifier votre avenir financier',
      monthly: 'Mensuel',
      yearly: 'Annuel',
      save: 'Économisez',
      perMonth: '/mois',
      perYear: '/an',
      popular: 'Populaire',
      recommended: 'Recommandé',
      features: 'Fonctionnalités',
      limits: 'Limites',
      startFree: 'Commencer gratuitement',
      startTrial: 'Essai gratuit 7 jours',
      currentPlan: 'Plan actuel',
      promoCode: 'Code promo',
      applyPromo: 'Appliquer',
      promoPlaceholder: 'Entrez votre code promo',
      unlimited: 'Illimité',
      simulations: 'simulations',
      reports: 'rapports',
      profiles: 'profils',
      exports: 'exports',
      storage: 'GB stockage',
      monteCarlo: 'Simulations Monte Carlo',
      taxOptimization: 'Optimisation fiscale',
      advancedReports: 'Rapports avancés',
      aiAdvice: 'Conseils IA',

      collaboration: 'Collaboration conseiller',
      support: 'Support prioritaire',
              earlyBird: 'Lancement - 30 %',
        savings: 'Économies - 40 %',
        founder: 'Fondateur - 50 %',
        tester: 'Testeur - 100 % gratuit'
    },
    en: {
      title: 'Choose Your Retirement Plan',
      subtitle: 'Powerful tools to plan your financial future',
      monthly: 'Monthly',
      yearly: 'Yearly',
      save: 'Save',
      perMonth: '/month',
      perYear: '/year',
      popular: 'Popular',
      recommended: 'Recommended',
      features: 'Features',
      limits: 'Limits',
      startFree: 'Start Free',
      startTrial: '7-Day Free Trial',
      currentPlan: 'Current Plan',
      promoCode: 'Promo Code',
      applyPromo: 'Apply',
      promoPlaceholder: 'Enter your promo code',
      unlimited: 'Unlimited',
      simulations: 'simulations',
      reports: 'reports',
      profiles: 'profiles',
      exports: 'exports',
      storage: 'GB storage',
      monteCarlo: 'Monte Carlo Simulations',
      taxOptimization: 'Tax Optimization',
      advancedReports: 'Advanced Reports',
      aiAdvice: 'AI Advice',

      collaboration: 'Advisor Collaboration',
      support: 'Priority Support',
      earlyBird: 'Launch - 30%',
      savings: 'Savings - 40%',
      founder: 'Founder - 50%',
      tester: 'Tester - 100% free'
    }
  };

  const handlePromoCode = () => {
    if (!promoCode) return;
    
    const promo = PROMO_CODES[promoCode.toUpperCase()];
    if (promo) {
      setAppliedPromo(promoCode.toUpperCase());
      setPromoError('');
    } else {
      setPromoError(lang === 'fr' ? 'Code promo invalide' : 'Invalid promo code');
      setAppliedPromo(null);
    }
  };

  const getPlanPrice = (plan: any) => {
    if (billingCycle === 'year' && plan.annualPrice !== undefined) {
      const finalPrice = appliedPromo ? calculatePriceWithPromo(plan.annualPrice, appliedPromo) : plan.annualPrice;
      return {
        price: finalPrice,
        originalPrice: plan.annualPrice,
        period: t[lang].perYear,
        savings: calculateAnnualSavings(plan.price, plan.annualPrice)
      };
    } else {
      const finalPrice = appliedPromo ? calculatePriceWithPromo(plan.price, appliedPromo) : plan.price;
      return {
        price: finalPrice,
        originalPrice: plan.price,
        period: t[lang].perMonth,
        savings: 0
      };
    }
  };

  const getFeatureIcon = (feature: string) => {
    switch (feature) {
      case 'monteCarlo': return <BarChart3 className="w-4 h-4" />;
      case 'taxOptimization': return <Shield className="w-4 h-4" />;
      case 'advancedReports': return <FileText className="w-4 h-4" />;
      case 'aiAdvice': return <Brain className="w-4 h-4" />;

      case 'collaboration': return <Users className="w-4 h-4" />;
      default: return <Check className="w-4 h-4" />;
    }
  };

  const plans = [
    {
      ...PLANS.free,
      icon: <Star className="w-6 h-6" />,
      color: 'from-gray-400 to-gray-600',
      badge: null
    },
    {
      ...PLANS.premium,
      icon: <Zap className="w-6 h-6" />,
      color: 'from-blue-500 to-purple-600',
      badge: t[lang].recommended
    },
    {
      ...PLANS.enterprise,
      icon: <Crown className="w-6 h-6" />,
      color: 'from-yellow-400 to-orange-500',
      badge: t[lang].popular
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {t[lang].title}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t[lang].subtitle}
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex justify-center mb-12">
          <div className="bg-white rounded-lg p-1 shadow-lg">
            <div className="flex">
              <button
                onClick={() => setBillingCycle('month')}
                className={`px-6 py-2 rounded-md font-medium transition-all ${
                  billingCycle === 'month'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {t[lang].monthly}
              </button>
              <button
                onClick={() => setBillingCycle('year')}
                className={`px-6 py-2 rounded-md font-medium transition-all ${
                  billingCycle === 'year'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {t[lang].yearly}
              </button>
            </div>
          </div>
        </div>

        {/* Promo Code */}
        <div className="flex justify-center mb-8">
          <div className="flex gap-2 max-w-md w-full">
            <input
              type="text"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              placeholder={t[lang].promoPlaceholder}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={handlePromoCode}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {t[lang].applyPromo}
            </button>
          </div>
        </div>

        {promoError && (
          <div className="text-center mb-4">
            <p className="text-red-600">{promoError}</p>
          </div>
        )}

        {appliedPromo && (
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full">
              <Check className="w-4 h-4" />
              <span className="font-medium">
                {lang === 'fr' ? 'Code promo appliqué : ' : 'Promo code applied: '}
                {appliedPromo}
              </span>
            </div>
          </div>
        )}

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => {
            const pricing = getPlanPrice(plan);
            const isPopular = plan.badge === t[lang].popular;
            const isRecommended = plan.badge === t[lang].recommended;

            return (
              <div
                key={plan.id}
                className={`relative bg-white rounded-2xl shadow-xl p-8 transition-all duration-300 hover:scale-105 ${
                  isPopular ? 'ring-2 ring-yellow-400 transform scale-105' : ''
                }`}
              >
                {/* Badge */}
                {plan.badge && (
                  <div className={`absolute -top-4 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-full text-sm font-bold ${
                    isPopular
                      ? 'bg-yellow-400 text-black'
                      : 'bg-blue-600 text-white'
                  }`}>
                    {plan.badge}
                  </div>
                )}

                {/* Header */}
                <div className="text-center mb-8">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r ${plan.color} text-white mb-4`}>
                    {plan.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {plan.name}
                  </h3>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold text-gray-900">
                      {pricing.price === 0 ? '0' : pricing.price}
                    </span>
                    {pricing.price > 0 && (
                      <span className="text-2xl font-bold text-gray-900">
                        {pricing.currency}
                      </span>
                    )}
                    <span className="text-xl text-gray-600">
                      {pricing.period}
                    </span>
                  </div>
                  {pricing.savings > 0 && (
                    <p className="text-green-600 font-medium mt-2">
                      {t[lang].save} {pricing.savings} {t[lang].perYear}
                    </p>
                  )}
                  {appliedPromo && pricing.price < pricing.originalPrice && (
                    <p className="text-red-600 line-through text-lg mt-1">
                      {pricing.originalPrice} {pricing.currency}{pricing.period}
                    </p>
                  )}
                </div>

                {/* Features */}
                <div className="space-y-4 mb-8">
                  <h4 className="font-semibold text-gray-900 mb-3">
                    {t[lang].features}
                  </h4>
                  <div className="space-y-3">
                    {Object.entries(plan.features).map(([feature, enabled]) => (
                      <div key={feature} className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                          enabled ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                        }`}>
                          {enabled ? <Check className="w-3 h-3" /> : <span className="text-xs">×</span>}
                        </div>
                        <span className={`text-sm ${enabled ? 'text-gray-900' : 'text-gray-500'}`}>
                          {t[lang][feature as keyof typeof t.fr] || feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Limits */}
                <div className="space-y-4 mb-8">
                  <h4 className="font-semibold text-gray-900 mb-3">
                    {t[lang].limits}
                  </h4>
                  <div className="space-y-3">
                    {Object.entries(plan.limits).map(([limit, value]) => (
                      <div key={limit} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">
                          {t[lang][limit as keyof typeof t.fr] || limit}
                        </span>
                        <span className="text-sm font-medium text-gray-900">
                          {value === -1 ? t[lang].unlimited : value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA Button */}
                <button className={`w-full py-3 px-6 rounded-lg font-semibold transition-all ${
                  plan.id === 'free'
                    ? 'bg-gray-600 text-white hover:bg-gray-700'
                    : isPopular
                    ? 'bg-yellow-500 text-black hover:bg-yellow-600'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}>
                  {plan.id === 'free' ? t[lang].startFree : t[lang].startTrial}
                </button>
              </div>
            );
          })}
        </div>

        {/* Promo Codes Info */}
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">
            {lang === 'fr' ? 'Codes promo disponibles' : 'Available Promo Codes'}
          </h3>
          <div className="grid md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {Object.entries(PROMO_CODES).map(([code, promo]) => (
              <div key={code} className="bg-white rounded-lg p-4 shadow-md">
                <div className="font-bold text-lg text-blue-600 mb-2">{code}</div>
                <div className="text-sm text-gray-600 mb-2">
                  {lang === 'fr' ? promo.description : promo.description.replace('Tests et développement', 'Testing & Development')}
                </div>
                <div className="text-2xl font-bold text-green-600">
                  {promo.discount}%
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
