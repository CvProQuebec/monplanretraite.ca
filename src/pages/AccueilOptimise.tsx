import React, { useState, useMemo } from 'react';
import { useLanguage } from '@/features/retirement/hooks/useLanguage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import OnboardingWizard from '@/features/retirement/components/OnboardingWizard';
import { 
  CheckCircle,
  XCircle,
  BarChart3,
  TrendingUp,
  Calendar,
  Zap,
  Shield,
  Heart,
  Crown,
  Sparkles,
  ArrowRight,
  AlertCircle,
  AlertTriangle,
  Home,
  Target,
  Users,
  Calculator,
  Phone,
  FileText
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AdvancedUpgradeModal from '@/components/ui/advanced-upgrade-modal';
import { getAllPosts } from '@/pages/blog/utils/content';

const AccueilOptimise: React.FC = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const isFrench = language === 'fr';
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [targetPlan, setTargetPlan] = useState<'professional' | 'expert'>('professional');
  const [showOnboardingWizard, setShowOnboardingWizard] = useState(false);

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const handleUpgradeClick = (plan: 'professional' | 'expert') => {
    setTargetPlan(plan);
    setIsUpgradeModalOpen(true);
  };

  const handleOnboardingComplete = (userData: any) => {
    console.log('✅ Onboarding terminé avec succès:', userData);
    setShowOnboardingWizard(false);
    navigate('/ma-retraite');
  };

  const handleOnboardingSkip = () => {
    setShowOnboardingWizard(false);
  };

  // Compteur dynamique d'articles publiés
  const totalBlogCount = useMemo(() => getAllPosts().filter(p => p.status === 'published').length, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-mpr-interactive-lt via-white to-purple-50">
      
      {/* Contenu principal optimisé */}
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-6xl mx-auto">

          {/* SECTION 1: Hook émotionnel - NOUVEAU */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              {isFrench ? 'Votre retraite mérite mieux qu\'un plan sur le coin d\'une table' : 'Your retirement deserves better than a plan on a napkin'}
            </h1>
                <p className="text-2xl text-gray-700 max-w-4xl mx-auto mb-6">
              {isFrench 
                ? 'Préparez-vous efficacement avec nos outils professionnels. Gagnez du temps et maximisez la valeur de vos décisions.'
                : 'Prepare effectively with our professional tools. Save time and maximize the value of your decisions.'
              }
            </p>
            <div className="inline-block bg-red-500 text-white px-6 py-3 rounded-xl font-bold text-lg mb-8">
              {isFrench 
                ? '🔥 Prix 50% inférieurs à la concurrence!'
                : '🔥 Prices 50% lower than competition!'
              }
            </div>
          </div>

          {/* SECTION 2: Service Gratuit - VERSION OPTIMISÉE (60% plus court) */}
          <Card className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-2xl mb-16 border-0 overflow-hidden relative">
            <CardContent className="p-8 relative z-10">
              <div className="text-center mb-8">
                <div className="inline-block bg-yellow-400 text-yellow-900 px-4 py-2 rounded-full text-sm font-bold mb-4">
                  🎁 {isFrench ? 'SERVICE GRATUIT' : 'FREE SERVICE'}
                </div>
                <h2 className="text-4xl font-bold mb-4">
                  {isFrench ? 'Trousse de protection familiale' : 'Family Protection Kit'}
                </h2>
                <p className="text-xl text-emerald-100 max-w-3xl mx-auto mb-2">
                  {isFrench 
                    ? 'Le premier pas essentiel avant de rencontrer un professionnel.'
                    : 'The essential first step before meeting a professional.'
                  }
                </p>
                <div className="text-sm text-emerald-100 max-w-3xl mx-auto mb-6">
                  {isFrench
                    ? 'Inclut 8 sections : Personnes, Documents, Finances, Testament, Santé, Assurances, Accès, Vérification.'
                    : 'Includes 8 sections: People, Documents, Finances, Will, Health, Insurance, Access, Verification.'}
                </div>
              </div>

              {/* 4 icônes simplifiées */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                <div className="text-center">
                  <Phone className="w-12 h-12 text-white mx-auto mb-2" />
                  <h3 className="font-semibold">{isFrench ? 'Contacts d\'urgence' : 'Emergency contacts'}</h3>
                </div>
                <div className="text-center">
                  <Heart className="w-12 h-12 text-white mx-auto mb-2" />
                  <h3 className="font-semibold">{isFrench ? 'Infos médicales' : 'Medical info'}</h3>
                </div>
                <div className="text-center">
                  <FileText className="w-12 h-12 text-white mx-auto mb-2" />
                  <h3 className="font-semibold">{isFrench ? 'Documents légaux' : 'Legal documents'}</h3>
                </div>
                <div className="text-center">
                  <Users className="w-12 h-12 text-white mx-auto mb-2" />
                  <h3 className="font-semibold">{isFrench ? 'Responsabilités' : 'Responsibilities'}</h3>
                </div>
              </div>

              <div className="text-center">
                <Button 
                  onClick={() => handleNavigation('/planification-urgence')}
                  size="lg"
                  className="bg-white text-emerald-600 hover:bg-gray-100 font-bold px-12 py-4 text-xl rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  {isFrench ? '🎯 Créer ma trousse GRATUITE' : '🎯 Create my FREE Kit'}
                  <ArrowRight className="ml-3 w-6 h-6" />
                </Button>
                <p className="text-emerald-200 text-sm mt-4">
                  {isFrench ? '✨ Aucune inscription requise • Données 100 % privées' : '✨ No registration required • 100% private data'}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* SECTION: Bibliothèque d'articles — compteur dynamique + CTA */}
          <Card className="bg-white border-2 border-gray-200 shadow-xl mb-16">
            <CardContent className="p-6 text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                {isFrench ? `Bibliothèque d’articles — ${totalBlogCount}+ articles` : `Articles Library — ${totalBlogCount}+ articles`}
              </h2>
              <p className="text-gray-700 mb-6">
                {isFrench
                  ? 'Accédez gratuitement à notre bibliothèque pour bien vous préparer à la retraite.'
                  : 'Free access to our library to get ready for retirement.'}
              </p>
              <img
                src="/articles.png"
                alt={isFrench ? 'Aper\u00E7u RRQ/CPP \u2014 montants et impact' : 'RRQ/CPP preview — amounts and impact'}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-emerald-500" />
                        <span className="text-sm">{isFrench ? 'Calculatrice de rendement simple' : 'Simple return calculator'}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-emerald-500" />
                        <span className="text-sm">{isFrench ? "Comparateur d'options d'achat" : 'Purchase options comparator'}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-emerald-500" />
                        <span className="text-sm">{isFrench ? 'Estimateur de budget mensuel (lite)' : 'Monthly budget estimator (lite)'}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-emerald-500" />
                        <span className="text-sm">{isFrench ? 'Aperçu RRQ/CPP — montants et impact' : 'RRQ/CPP preview — amounts and impact'}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-emerald-500" />
                        <span className="text-sm">{isFrench ? 'Conseils essentiels (aperçu)' : 'Essential tips (preview)'}</span>
                      </div>
                    </div>
                    <Button 
                      onClick={() => setShowOnboardingWizard(true)}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3"
                    >
                      {isFrench ? 'Commencer GRATUITEMENT' : 'Start FREE'}
                    </Button>
                  </CardContent>
                </Card>

                {/* PLAN PROFESSIONNEL - Simplifié */}
                <Card className="bg-white border-4 border-mpr-interactive shadow-2xl relative">
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-mpr-interactive text-white px-6 py-2 rounded-full text-sm font-bold">
                      {isFrench ? '⭐ RECOMMANDÉ' : '⭐ RECOMMENDED'}
                    </div>
                  </div>
                  <CardHeader className="text-center pt-8">
                    <div className="w-16 h-16 bg-mpr-interactive rounded-full flex items-center justify-center mx-auto mb-4">
                      <Sparkles className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-mpr-navy">
                      {isFrench ? 'Professionnel' : 'Professional'}
                    </CardTitle>
                    <div className="text-4xl font-bold text-mpr-interactive mb-1">297 $</div>
                    <div className="text-sm text-mpr-interactive">{isFrench ? '/an' : '/year'}</div>
                  </CardHeader>
                  <CardContent className="px-6 pb-8">
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-mpr-interactive" />
                        <span className="text-sm">{isFrench ? 'Tout du plan Gratuit +' : 'Everything from Free +'}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Sparkles className="w-5 h-5 text-yellow-500" />
                        <span className="text-sm font-semibold">{isFrench ? 'Assistant IA Personnel' : 'Personal AI Assistant'}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-mpr-interactive" />
                        <span className="text-sm">{isFrench ? 'Simulations illimitées' : 'Unlimited simulations'}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-mpr-interactive" />
                        <span className="text-sm">{isFrench ? 'Optimisation fiscale' : 'Tax optimization'}</span>
                      </div>
                    </div>
                    <Button 
                      onClick={() => handleUpgradeClick('professional')}
                      className="w-full bg-mpr-interactive hover:bg-mpr-interactive-dk text-white font-bold py-3"
                    >
                      {isFrench ? 'Choisir Professionnel' : 'Choose Professional'}
                    </Button>
                  </CardContent>
                </Card>

                {/* PLAN EXPERT - Simplifié */}
                <Card className="bg-white border-2 border-purple-300 shadow-xl">
                  <CardHeader className="text-center pt-6">
                    <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Crown className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-purple-900">
                      {isFrench ? 'Expert' : 'Expert'}
                    </CardTitle>
                    <div className="text-4xl font-bold text-purple-600 mb-1">597 $</div>
                    <div className="text-sm text-purple-600">{isFrench ? '/an' : '/year'}</div>
                  </CardHeader>
                  <CardContent className="px-6 pb-8">
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-purple-500" />
                        <span className="text-sm">{isFrench ? 'Tout du plan Professionnel +' : 'Everything from Professional +'}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Users className="w-5 h-5 text-pink-500" />
                        <span className="text-sm font-semibold">{isFrench ? 'Planification successorale' : 'Estate planning'}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-purple-500" />
                        <span className="text-sm">{isFrench ? 'Simulations Monte Carlo' : 'Monte Carlo simulations'}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-purple-500" />
                        <span className="text-sm">{isFrench ? 'Support prioritaire' : 'Priority support'}</span>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleUpgradeClick('expert')}
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3"
                    >
                      {isFrench ? 'Choisir Expert' : 'Choose Expert'}
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <div className="text-center mt-8">
                <p className="text-mpr-interactive-lt text-sm">
                  {isFrench ? '✨ Garantie 14 jours remboursé sur tous les plans payants' : '✨ 14-day money-back guarantee on all paid plans'}
                </p>
              </div>
            </div>
          </div>

          {/* SECTION 5: CTA Final - Optimisé */}
          <Card className="bg-gradient-to-r from-mpr-interactive to-purple-600 text-white border-0 shadow-2xl">
            <CardContent className="text-center p-12">
              <h2 className="text-4xl font-bold mb-6">
                {isFrench ? 'Prêt à prendre le contrôle de votre avenir?' : 'Ready to take control of your future?'}
              </h2>
              <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
                {isFrench 
                  ? 'Rejoignez des milliers de Québécois qui ont déjà commencé leur planification.'
                  : 'Join thousands of Quebecers who have already started their planning.'
                }
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={() => setShowOnboardingWizard(true)}
                  size="lg"
                  className="bg-white text-mpr-interactive hover:bg-gray-100 font-bold px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {isFrench ? '🎯 Commencer GRATUITEMENT' : '🎯 Start FREE'}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button 
                  onClick={() => handleUpgradeClick('professional')}
                  size="lg"
                  variant="outline"
                  className="border-2 border-white text-white hover:bg-white hover:text-mpr-interactive font-bold px-8 py-4 text-lg rounded-xl transition-all duration-300"
                >
                  {isFrench ? '🚀 Voir les plans payants' : '🚀 View paid plans'}
                </Button>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>

      {/* Modals */}
      <AdvancedUpgradeModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
        requiredPlan={targetPlan}
        featureName="plan_upgrade"
        currentPlan="free"
      />

      {showOnboardingWizard && (
        <OnboardingWizard
          onComplete={handleOnboardingComplete}
          onSkip={handleOnboardingSkip}
          isFrench={isFrench}
        />
      )}

    </div>
  );
};

export default AccueilOptimise;
