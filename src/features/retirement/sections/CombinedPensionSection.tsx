import React from 'react';

interface CombinedPensionSectionProps {
  className?: string;
}

export const CombinedPensionSection: React.FC<CombinedPensionSectionProps> = ({ className }) => {
  // Détection simple de la langue depuis l'URL
  const isFrench = window.location.pathname.includes('/fr/') || !window.location.pathname.includes('/en/');
  
  const texts = {
    fr: {
      title: 'Planification Combinée CPP + RRQ',
      subtitle: 'Optimisez votre retraite en combinant les prestations gouvernementales et l\'épargne personnelle',
      features: 'Fonctionnalités',
      overview: 'Vue d\'ensemble',
      planner: 'Planificateur',
      comparison: 'Comparaison CPP vs RRQ',
      description: 'Cette section vous permet de planifier votre retraite en tenant compte de tous vos revenus : la pension du Régime de pensions du Canada (CPP), la rente du Régime des rentes du Québec (RRQ) et votre épargne personnelle.',
      keyFeatures: [
        'Calcul combiné CPP + RRQ + Épargne personnelle',
        'Scénarios de retraite personnalisés',
        'Simulation Monte Carlo pour l\'évaluation des risques',
        'Optimisation fiscale et planification successorale',
        'Recommandations personnalisées basées sur votre situation'
      ],
      benefits: 'Avantages de la planification combinée',
      benefitsList: [
        'Vision complète de vos revenus de retraite',
        'Identification des lacunes dans votre planification',
        'Optimisation de l\'âge de retraite',
        'Réduction des risques financiers',
        'Maximisation des prestations gouvernementales'
      ],
      startPlanning: 'Commencer la planification',
      learnMore: 'En savoir plus sur CPP vs RRQ',
      officialCPP: 'Site officiel du CPP',
      officialRRQ: 'Site officiel du RRQ'
    },
    en: {
      title: 'Combined CPP + RRQ Planning',
      subtitle: 'Optimize your retirement by combining government benefits and personal savings',
      features: 'Features',
      overview: 'Overview',
      planner: 'Planner',
      comparison: 'CPP vs RRQ Comparison',
      description: 'This section allows you to plan your retirement by considering all your income sources: Canada Pension Plan (CPP) benefits, Quebec Pension Plan (RRQ) benefits, and your personal savings.',
      keyFeatures: [
        'Combined CPP + RRQ + Personal savings calculation',
        'Personalized retirement scenarios',
        'Monte Carlo simulation for risk assessment',
        'Tax optimization and estate planning',
        'Personalized recommendations based on your situation'
      ],
      benefits: 'Benefits of combined planning',
      benefitsList: [
        'Complete view of your retirement income',
        'Identify gaps in your planning',
        'Optimize retirement age',
        'Reduce financial risks',
        'Maximize government benefits'
      ],
      startPlanning: 'Start planning',
      learnMore: 'Learn more about CPP vs RRQ',
      officialCPP: 'Official CPP website',
      officialRRQ: 'Official RRQ website'
    }
  };
  
  const t = texts[isFrench ? 'fr' : 'en'];
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-mpr-navy text-white">
      <div className="container mx-auto px-6 py-8">
        <div className="space-y-8">
          {/* En-tête de la section */}
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent drop-shadow-2xl mb-4">
              {t.title}
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              {t.subtitle}
            </p>
          </div>

          {/* Description principale */}
          <div className="bg-white/10 backdrop-blur-sm border-purple-300/30 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-purple-400 mb-4 flex items-center gap-3">
              <span className="text-3xl">🛡️</span>
              {isFrench ? 'Vue d\'ensemble' : 'Overview'}
            </h2>
            <p className="text-gray-200 text-lg leading-relaxed">
              {t.description}
            </p>
          </div>

          {/* Fonctionnalités clés */}
          <div className="bg-white/10 backdrop-blur-sm border-mpr-border/30 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-mpr-interactive mb-4 flex items-center gap-3">
              <span className="text-3xl">✨</span>
              {t.features}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {t.keyFeatures.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <span className="text-green-400 text-xl">✓</span>
                  <span className="text-gray-200">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Avantages de la planification combinée */}
          <div className="bg-white/10 backdrop-blur-sm border-green-300/30 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-green-400 mb-4 flex items-center gap-3">
              <span className="text-3xl">📈</span>
              {t.benefits}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {t.benefitsList.map((benefit, index) => (
                <div key={index} className="flex items-start gap-3">
                  <span className="text-yellow-400 text-xl">⚡</span>
                  <span className="text-gray-200">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Sections interactives */}
          <div className="space-y-6">
            {/* Vue d'ensemble */}
            <div className="bg-white/10 backdrop-blur-sm border-purple-300/30 rounded-lg p-6">
              <h3 className="text-xl font-bold text-purple-400 mb-4 flex items-center gap-3">
                <span className="text-2xl">📊</span>
                {t.overview}
              </h3>
              <div className="space-y-4">
                <p className="text-gray-200">
                  {isFrench 
                    ? 'La plupart des Québécois peuvent recevoir à la fois le CPP (pension fédérale) et le RRQ (pension provinciale). Cette combinaison peut représenter jusqu\'à 50% de vos revenus de retraite.'
                    : 'Most Quebecers can receive both CPP (federal pension) and RRQ (provincial pension). This combination can represent up to 50% of your retirement income.'
                  }
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="p-4 bg-purple-900/20 rounded-lg border border-purple-300/20">
                    <h4 className="font-semibold text-purple-300 mb-2">CPP</h4>
                    <p className="text-purple-200 text-sm">
                      {isFrench ? 'Pension fédérale canadienne' : 'Federal Canadian pension'}
                    </p>
                  </div>
                  <div className="p-4 bg-mpr-navy/20 rounded-lg border border-mpr-border/20">
                    <h4 className="font-semibold text-mpr-interactive mb-2">RRQ</h4>
                    <p className="text-mpr-interactive-lt text-sm">
                      {isFrench ? 'Pension provinciale québécoise' : 'Provincial Quebec pension'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Planificateur */}
            <div className="bg-white/10 backdrop-blur-sm border-mpr-border/30 rounded-lg p-6">
              <h3 className="text-xl font-bold text-mpr-interactive mb-4 flex items-center gap-3">
                <span className="text-2xl">🧮</span>
                {t.planner}
              </h3>
              <div className="space-y-4">
                <p className="text-gray-200">
                  {isFrench 
                    ? 'Le planificateur avancé vous permet de simuler différents scénarios de retraite en tenant compte de tous vos revenus.'
                    : 'The advanced planner allows you to simulate different retirement scenarios considering all your income sources.'
                  }
                </p>
                <button className="bg-mpr-interactive hover:bg-mpr-interactive-dk text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                  {t.startPlanning}
                </button>
              </div>
            </div>

            {/* Comparaison */}
            <div className="bg-white/10 backdrop-blur-sm border-green-300/30 rounded-lg p-6">
              <h3 className="text-xl font-bold text-green-400 mb-4 flex items-center gap-3">
                <span className="text-2xl">🎯</span>
                {t.comparison}
              </h3>
              <div className="space-y-4">
                <p className="text-gray-200">
                  {isFrench 
                    ? 'Comparez les prestations CPP et RRQ pour optimiser votre stratégie de retraite.'
                    : 'Compare CPP and RRQ benefits to optimize your retirement strategy.'
                  }
                </p>
                <button className="border-green-400 text-green-400 hover:bg-green-600 hover:text-white px-6 py-3 rounded-lg font-semibold transition-colors border-2">
                  {t.learnMore}
                </button>
              </div>
            </div>
          </div>

          {/* Liens officiels */}
          <div className="bg-white/10 backdrop-blur-sm border-yellow-300/30 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-yellow-400 mb-4 flex items-center gap-3">
              <span className="text-3xl">🔗</span>
              {isFrench ? 'Sites officiels' : 'Official Websites'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <a 
                href="https://www.canada.ca/fr/services/prestations/pensionspubliques/rpc.html"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-mpr-interactive hover:text-mpr-interactive transition-colors bg-mpr-navy/20 px-4 py-2 rounded-lg border border-mpr-interactive/30"
              >
                <span className="text-xl">🌐</span>
                {t.officialCPP}
              </a>
              <a 
                href="https://www.rrq.gouv.qc.ca/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-green-400 hover:text-green-300 transition-colors bg-green-900/20 px-4 py-2 rounded-lg border border-green-400/30"
              >
                <span className="text-xl">🌐</span>
                {t.officialRRQ}
              </a>
            </div>
          </div>

          {/* Badge de statut */}
          <div className="text-center">
            <div className="bg-purple-500 text-white px-6 py-3 rounded-lg text-lg font-bold inline-block">
              🚀 {isFrench ? 'Planification combinée disponible' : 'Combined Planning Available'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
