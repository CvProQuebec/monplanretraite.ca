import React, { useState } from 'react';
import { useLanguage } from '@/features/retirement/hooks/useLanguage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import OnboardingWizard from '@/components/ui/OnboardingWizard';
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
  Home as HomeIcon,
  Target,
  Users,
  Calculator,
  Phone,
  FileText
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AdvancedUpgradeModal from '@/components/ui/advanced-upgrade-modal';

const Home: React.FC = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const isFrench = language === 'fr';
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [targetPlan, setTargetPlan] = useState<'professional' | 'ultimate'>('professional');
  const [showOnboardingWizard, setShowOnboardingWizard] = useState(false);

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const handleUpgradeClick = (plan: 'professional' | 'ultimate') => {
    setTargetPlan(plan);
    setIsUpgradeModalOpen(true);
  };

  const handleOnboardingComplete = () => {
    console.log('✅ Onboarding completed successfully');
    setShowOnboardingWizard(false);
    navigate('/my-retirement');
  };

  const handleOnboardingSkip = () => {
    setShowOnboardingWizard(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      
      {/* Main content optimized */}
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-6xl mx-auto">

          {/* SECTION 1: Emotional hook - NEW */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              {isFrench ? (
                <>
                  Votre retraite mérite mieux<br />
                  qu'un plan sur le coin d'une table
                </>
              ) : (
                <>
                  Your retirement deserves better<br />
                  than a plan on a napkin
                </>
              )}
            </h1>
            <p className="text-2xl text-gray-700 max-w-4xl mx-auto mb-8">
              {isFrench ? (
                <>
                  Préparez-vous efficacement avec nos outils professionnels.<br />
                  Gagnez du temps et maximisez la valeur de vos consultations.
                </>
              ) : (
                <>
                  Prepare effectively with our professional tools.<br />
                  Save time and maximize the value of your consultations.
                </>
              )}
            </p>
            <div className="space-y-4 mb-8">
              <div className="inline-block bg-red-500 text-white px-6 py-3 rounded-xl font-bold text-lg">
                {isFrench 
                  ? '💰 Évitez des erreurs de 10 000 $+ avec nos outils professionnels'
                  : '💰 Avoid $10,000+ mistakes with our professional tools'
                }
              </div>
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg max-w-4xl mx-auto">
                <p className="text-yellow-800 font-medium">
                  {isFrench ? (
                    <>
                      ⚠️ Une mauvaise décision de retraite peut coûter des dizaines de milliers de dollars.<br />
                      Nos outils vous aident à prendre les bonnes décisions dès le départ.
                    </>
                  ) : (
                    <>
                      ⚠️ One bad retirement decision can cost tens of thousands of dollars.<br />
                      Our tools help you make the right decisions from the start.
                    </>
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* SECTION 2: Free Service - OPTIMIZED VERSION (60% shorter) */}
          <Card className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-2xl mb-16 border-0 overflow-hidden relative">
            <CardContent className="p-8 relative z-10">
              <div className="text-center mb-8">
                <div className="inline-block bg-yellow-400 text-yellow-900 px-4 py-2 rounded-full text-sm font-bold mb-4">
                  🎁 {isFrench ? 'SERVICE GRATUIT' : 'FREE SERVICE'}
                </div>
                <h2 className="text-4xl font-bold mb-4">
                  {isFrench ? 'Trousse de protection familiale' : 'Family Protection Kit'}
                </h2>
                <p className="text-xl text-emerald-100 max-w-3xl mx-auto mb-8">
                  {isFrench 
                    ? 'Complétez l\'information, imprimez et partagez avec les membres de votre famille ou votre personne de confiance.'
                    : 'Complete the information, print and share with family members or your trusted person.'
                  }
                </p>
              </div>

              {/* 4 simplified icons */}
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
                  onClick={() => handleNavigation('/emergency-planning')}
                  size="lg"
                  className="bg-white text-emerald-600 hover:bg-gray-100 font-bold px-12 py-4 text-xl rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  {isFrench ? '🎯 Créer ma trousse GRATUITE' : '🎯 Create my FREE Kit'}
                  <ArrowRight className="ml-3 w-6 h-6" />
                </Button>
                <p className="text-emerald-200 text-sm mt-4">
                  {isFrench ? '✨ Aucune inscription requise • Données 100% privées' : '✨ No registration required • 100% private data'}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* SECTION 3: What makes us different - MERGED AND OPTIMIZED */}
          <Card className="bg-white/90 backdrop-blur-sm border-2 border-blue-200 shadow-xl mb-16">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-3xl font-bold text-blue-900 mb-4">
                {isFrench ? 'Ce qui nous rend différents' : 'What makes us different'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {isFrench ? 'Seule solution gratuite' : 'Only free solution'}
                  </h3>
                  <p className="text-gray-700">
                    {isFrench 
                      ? 'Module d\'urgence professionnel offert gratuitement - une première au Québec'
                      : 'Professional emergency module offered for free - a first in Quebec'
                    }
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {isFrench ? 'Assistant IA exclusif' : 'Exclusive AI Assistant'}
                  </h3>
                  <p className="text-gray-700">
                    {isFrench 
                      ? 'Le premier assistant qui évite les catastrophes financières avant qu\'elles arrivent'
                      : 'The first assistant that prevents financial disasters before they happen'
                    }
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {isFrench ? 'Sécurité maximale' : 'Maximum security'}
                  </h3>
                  <p className="text-gray-700">
                    {isFrench 
                      ? 'Vos données restent sur votre appareil. Aucune transmission réseau.'
                      : 'Your data stays on your device. No network transmission.'
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* SECTION 4: Plan comparison - SIMPLIFIED VERSION (70% shorter) */}
          <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 py-16 rounded-2xl mb-16">
            <div className="container mx-auto px-6">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-white mb-4">
                  {isFrench ? 'Choisissez votre niveau de protection' : 'Choose your level of protection'}
                </h2>
                <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                  {isFrench 
                    ? 'De la protection gratuite à la planification complète avec IA'
                    : 'From free protection to complete AI-powered planning'
                  }
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* FREE PLAN - Simplified */}
                <Card className="bg-white border-2 border-emerald-200 shadow-xl">
                  <CardHeader className="text-center pt-6">
                    <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Shield className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-emerald-900">
                      {isFrench ? 'Gratuit' : 'Free'}
                    </CardTitle>
                    <div className="text-4xl font-bold text-emerald-600 mb-2">$0</div>
                  </CardHeader>
                  <CardContent className="px-6 pb-8">
                    <div className="space-y-2 mb-6">
                      <div className="bg-emerald-50 p-3 rounded-lg mb-3">
                        <div className="text-emerald-800 font-bold text-sm mb-1">
                          {isFrench ? '🎁 VALEUR : 500$+ GRATUIT' : '🎁 VALUE: $500+ FREE'}
                        </div>
                        <div className="text-emerald-700 text-xs">
                          {isFrench ? 'Seule plateforme au Québec à offrir cela gratuitement' : 'Only platform in Quebec offering this for free'}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                        <span className="text-xs">{isFrench ? 'Module d\'urgence professionnel (8 sections)' : 'Professional emergency module (8 sections)'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                        <span className="text-xs">{isFrench ? 'Planification budget et dépenses' : 'Budget and expense planning'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                        <span className="text-xs">{isFrench ? 'Calculateurs de base (5 outils)' : 'Basic calculators (5 tools)'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                        <span className="text-xs">{isFrench ? 'Gestion revenus et prestations RRQ/CPP' : 'Income and RRQ/CPP benefits management'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                        <span className="text-xs">{isFrench ? 'Sécurité bancaire (chiffrement AES-256)' : 'Banking security (AES-256 encryption)'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                        <span className="text-xs">{isFrench ? '5 simulations/mois • Données 100% privées' : '5 simulations/month • 100% private data'}</span>
                      </div>
                    </div>
                    <Button 
                      onClick={() => setShowOnboardingWizard(true)}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3"
                    >
                      {isFrench ? '🎯 Commencer GRATUITEMENT' : '🎯 Start FREE'}
                    </Button>
                  </CardContent>
                </Card>

                {/* PROFESSIONAL PLAN - Simplified */}
                <Card className="bg-white border-4 border-blue-400 shadow-2xl relative">
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-blue-500 text-white px-6 py-2 rounded-full text-sm font-bold">
                      {isFrench ? '⭐ RECOMMANDÉ' : '⭐ RECOMMENDED'}
                    </div>
                  </div>
                  <CardHeader className="text-center pt-8">
                    <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Sparkles className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-blue-900">
                      {isFrench ? 'Professionnel' : 'Professional'}
                    </CardTitle>
                    <div className="text-4xl font-bold text-blue-600 mb-1">$297</div>
                    <div className="text-sm text-blue-600">{isFrench ? '/an' : '/year'}</div>
                  </CardHeader>
                  <CardContent className="px-6 pb-8">
                    <div className="space-y-2 mb-6">
                      <div className="bg-blue-50 p-3 rounded-lg mb-3">
                        <div className="text-blue-800 font-bold text-sm mb-1">
                          {isFrench ? '💎 VALEUR : 5000$+ pour 297$' : '💎 VALUE: $5000+ for $297'}
                        </div>
                        <div className="text-blue-700 text-xs">
                          {isFrench ? 'Économie de 94% • Équivaut à 2 consultations' : '94% savings • Equals 2 consultations'}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-blue-500" />
                        <span className="text-xs font-medium">{isFrench ? 'Tout du plan Gratuit + 45 fonctionnalités' : 'Everything from Free + 45 features'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-yellow-500" />
                        <span className="text-xs font-semibold">{isFrench ? 'Assistant IA Personnel (prévention catastrophes)' : 'Personal AI Assistant (disaster prevention)'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-blue-500" />
                        <span className="text-xs">{isFrench ? 'Calculateurs avancés (IRR, TWR, Monte Carlo)' : 'Advanced calculators (IRR, TWR, Monte Carlo)'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-blue-500" />
                        <span className="text-xs">{isFrench ? 'Modules RREGOP + SRG complets' : 'Complete RREGOP + SRG modules'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-blue-500" />
                        <span className="text-xs">{isFrench ? 'Optimisation fiscale avancée (REER/CELI)' : 'Advanced tax optimization (RRSP/TFSA)'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-blue-500" />
                        <span className="text-xs">{isFrench ? 'Rapports professionnels • Simulations illimitées' : 'Professional reports • Unlimited simulations'}</span>
                      </div>
                    </div>
                    <Button 
                      onClick={() => handleUpgradeClick('professional')}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3"
                    >
                      {isFrench ? 'Choisir Professionnel' : 'Choose Professional'}
                    </Button>
                  </CardContent>
                </Card>

                {/* EXPERT PLAN - Simplified */}
                <Card className="bg-white border-2 border-purple-300 shadow-xl">
                  <CardHeader className="text-center pt-6">
                    <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Crown className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-purple-900">
                      {isFrench ? 'Expert' : 'Ultimate'}
                    </CardTitle>
                    <div className="text-4xl font-bold text-purple-600 mb-1">$597</div>
                    <div className="text-sm text-purple-600">{isFrench ? '/an' : '/year'}</div>
                  </CardHeader>
                  <CardContent className="px-6 pb-8">
                    <div className="space-y-2 mb-6">
                      <div className="bg-purple-50 p-3 rounded-lg mb-3">
                        <div className="text-purple-800 font-bold text-sm mb-1">
                          {isFrench ? '👑 VALEUR : 10 000$+ pour 597$' : '👑 VALUE: $10,000+ for $597'}
                        </div>
                        <div className="text-purple-700 text-xs">
                          {isFrench ? 'Niveau consultant • Économie de 94% • Évite erreurs coûteuses' : 'Consultant level • 94% savings • Prevents costly mistakes'}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-purple-500" />
                        <span className="text-xs font-medium">{isFrench ? 'Suite complète : 75+ fonctionnalités' : 'Complete suite: 75+ features'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-pink-500" />
                        <span className="text-xs font-semibold">{isFrench ? 'Planification successorale complète' : 'Complete estate planning'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-purple-500" />
                        <span className="text-xs">{isFrench ? 'Monte Carlo 1000+ itérations • IA prédictive' : 'Monte Carlo 1000+ iterations • Predictive AI'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-purple-500" />
                        <span className="text-xs">{isFrench ? 'Optimisation immobilière avancée' : 'Advanced real estate optimization'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-purple-500" />
                        <span className="text-xs">{isFrench ? 'Rapports niveau consultant • Export PDF' : 'Consultant-level reports • PDF export'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Crown className="w-4 h-4 text-purple-500" />
                        <span className="text-xs font-semibold">{isFrench ? 'Support prioritaire • Consultation virtuelle' : 'Priority support • Virtual consultation'}</span>
                      </div>
                    </div>
                    <Button 
                      onClick={() => handleUpgradeClick('ultimate')}
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3"
                    >
                      {isFrench ? 'Choisir Expert' : 'Choose Ultimate'}
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <div className="text-center mt-8">
                <p className="text-blue-200 text-sm">
                  {isFrench ? '✨ Garantie 30 jours remboursé sur tous les plans payants' : '✨ 30-day money-back guarantee on all paid plans'}
                </p>
              </div>
            </div>
          </div>


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

      <OnboardingWizard
        isOpen={showOnboardingWizard}
        onClose={() => setShowOnboardingWizard(false)}
        onComplete={handleOnboardingComplete}
      />

    </div>
  );
};

export default Home;
