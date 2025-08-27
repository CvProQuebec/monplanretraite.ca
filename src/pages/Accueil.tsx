import React, { useState } from 'react';
import { useLanguage } from '@/features/retirement/hooks/useLanguage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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


const Accueil: React.FC = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const isFrench = language === 'fr';
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [targetPlan, setTargetPlan] = useState<'professional' | 'ultimate'>('professional');

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const handleUpgradeClick = (plan: 'professional' | 'ultimate') => {
    setTargetPlan(plan);
    setIsUpgradeModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">

      
      {/* Contenu principal - Directement la planification financière */}
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-6xl mx-auto">

          {/* NOUVEAU - Section Service Gratuit - Trousse de protection familiale */}
          <Card className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-2xl mb-12 border-0 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
            <CardContent className="p-8 relative z-10">
              <div className="text-center mb-8">
                <div className="flex justify-center mb-6">
                  <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <Shield className="w-10 h-10 text-white" />
                  </div>
                </div>
                <div className="inline-block bg-yellow-400 text-yellow-900 px-4 py-2 rounded-full text-sm font-bold mb-4">
                  🎁 {isFrench ? 'SERVICE GRATUIT' : 'FREE SERVICE'}
                </div>
                <h2 className="text-4xl font-bold mb-4">
                  {isFrench ? 'Forfait de protection familiale' : 'Family Protection Kit'}
                </h2>
                <p className="text-xl text-emerald-100 max-w-4xl mx-auto mb-8">
                  {isFrench ? (
                    <>
                      Protégez vos proches avec un plan d'urgence complet.
                      <br />
                      Le premier pas essentiel avant de rencontrer un professionnel.
                    </>
                  ) : (
                    'Protect your loved ones with a comprehensive emergency plan. The essential first step before meeting a professional.'
                  )}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Phone className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    {isFrench ? 'Contacts d\'urgence' : 'Emergency contacts'}
                  </h3>
                  <p className="text-emerald-100 text-sm">
                    {isFrench 
                      ? 'Qui contacter en cas d\'urgence'
                      : 'Who to contact in emergencies'
                    }
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Heart className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    {isFrench ? 'Infos médicales' : 'Medical info'}
                  </h3>
                  <p className="text-emerald-100 text-sm">
                    {isFrench 
                      ? 'Allergies, médicaments, directives'
                      : 'Allergies, medications, directives'
                    }
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    {isFrench ? 'Documents légaux' : 'Legal documents'}
                  </h3>
                  <p className="text-emerald-100 text-sm">
                    {isFrench 
                      ? 'Testament, mandats, assurances'
                      : 'Will, mandates, insurance'
                    }
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    {isFrench ? 'Responsabilités' : 'Responsibilities'}
                  </h3>
                  <p className="text-emerald-100 text-sm">
                    {isFrench 
                      ? 'Enfants, parents, animaux'
                      : 'Children, parents, pets'
                    }
                  </p>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-8">
                <h3 className="text-xl font-bold mb-4 text-center">
                  {isFrench ? 'Pourquoi commencer par ici?' : 'Why start here?'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <CheckCircle className="w-8 h-8 text-yellow-300 mx-auto mb-3" />
                    <h4 className="font-semibold mb-2">
                      {isFrench ? 'Gratuit et sans engagement' : 'Free and no commitment'}
                    </h4>
                    <p className="text-sm text-emerald-100">
                      {isFrench 
                        ? 'Familiarisez-vous avec nos outils sans pression'
                        : 'Get familiar with our tools without pressure'
                      }
                    </p>
                  </div>
                  <div className="text-center">
                    <Target className="w-8 h-8 text-yellow-300 mx-auto mb-3" />
                    <h4 className="font-semibold mb-2">
                      {isFrench ? 'Prépare vos rencontres' : 'Prepares your meetings'}
                    </h4>
                    <p className="text-sm text-emerald-100">
                      {isFrench 
                        ? 'Arrivez organisé chez votre conseiller'
                        : 'Arrive organized at your advisor\'s'
                      }
                    </p>
                  </div>
                  <div className="text-center">
                    <Sparkles className="w-8 h-8 text-yellow-300 mx-auto mb-3" />
                    <h4 className="font-semibold mb-2">
                      {isFrench ? 'Découvrez notre approche' : 'Discover our approach'}
                    </h4>
                    <p className="text-sm text-emerald-100">
                      {isFrench 
                        ? 'Testez la qualité de nos solutions'
                        : 'Test the quality of our solutions'
                      }
                    </p>
                  </div>
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

          {/* Section Votre retraite, votre histoire */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <Heart className="w-8 h-8 text-red-500" />
              </div>
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {isFrench ? 'Votre solution complète avant de rencontrer un professionnel' : 'Your complete solution before meeting a professional'}
            </h2>
            <p className="text-xl text-gray-700 max-w-4xl mx-auto mb-12">
              {isFrench ? (
                <>
                  Préparez-vous efficacement avec nos outils professionnels.
                  <br />
                  Gagnez du temps et maximisez la valeur de vos consultations.
                </>
              ) : (
                'Prepare effectively with our professional tools. Save time and maximize the value of your consultations.'
              )}
            </p>

            {/* Section Notre engagement */}
            <Card className="bg-white/90 backdrop-blur-sm border-2 border-blue-200 shadow-xl mb-8">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl font-bold text-blue-900 flex items-center justify-center gap-3">
                  <Shield className="w-6 h-6 text-blue-600" />
                  {isFrench ? 'Notre engagement' : 'Our commitment'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Ce que nous reconnaissons */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      {isFrench ? 'Ce que nous reconnaissons :' : 'What we recognize:'}
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                        <p className="text-gray-700">
                          {isFrench 
                            ? 'Le stress financier peut être angoissant'
                            : 'Financial stress can be overwhelming'
                          }
                        </p>
                      </div>
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                        <p className="text-gray-700">
                          {isFrench 
                            ? 'Le sentiment d\'abandon face à la complexité'
                            : 'The feeling of abandonment facing complexity'
                          }
                        </p>
                      </div>
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                        <p className="text-gray-700">
                          {isFrench 
                            ? 'Les barrières économiques traditionnelles'
                            : 'Traditional economic barriers'
                          }
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Notre promesse */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      {isFrench ? 'Notre promesse :' : 'Our promise:'}
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <p className="text-gray-700">
                          {isFrench 
                            ? 'Accessibilité pour tous, pas seulement les fortunés'
                            : 'Accessibility for all, not just the wealthy'
                          }
                        </p>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <p className="text-gray-700">
                          {isFrench 
                            ? 'Bienveillance sans jugement ni pression'
                            : 'Kindness without judgment or pressure'
                          }
                        </p>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <p className="text-gray-700">
                          {isFrench 
                            ? 'Accompagnement personnalisé selon vos moyens'
                            : 'Personalized support according to your means'
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

          </div>

          {/* Section Assistant Financier Personnel - NOUVEAU */}
          <Card className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-2xl mb-12 border-0">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <div className="flex justify-center mb-6">
                  <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <Sparkles className="w-10 h-10 text-white" />
                  </div>
                </div>
                <h2 className="text-3xl font-bold mb-4">
                  {isFrench ? '🚀 NOUVEAU : Assistant Financier Personnel' : '🚀 NEW: Personal Financial Assistant'}
                </h2>
                <p className="text-xl text-indigo-100 max-w-3xl mx-auto mb-8">
                  {isFrench 
                    ? 'Le premier assistant au monde qui évite les catastrophes financières avant qu\'elles arrivent!'
                    : 'The world\'s first AI assistant that prevents financial disasters before they happen!'
                  }
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <AlertTriangle className="w-8 h-8 text-yellow-300" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    {isFrench ? 'Évite les découverts' : 'Prevents overdrafts'}
                  </h3>
                  <p className="text-indigo-100 text-sm">
                    {isFrench 
                      ? 'Analyse l\'impact de chaque achat sur votre flux de trésorerie'
                      : 'Analyzes the impact of every purchase on your cash flow'
                    }
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <BarChart3 className="w-8 h-8 text-green-300" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    {isFrench ? 'Optimise le timing' : 'Optimizes timing'}
                  </h3>
                  <p className="text-indigo-100 text-sm">
                    {isFrench 
                      ? 'Recommande le meilleur moment pour vos achats importants'
                      : 'Recommends the best time for your major purchases'
                    }
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="w-8 h-8 text-blue-300" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    {isFrench ? 'Score financier' : 'Financial score'}
                  </h3>
                  <p className="text-indigo-100 text-sm">
                    {isFrench 
                      ? 'Évalue votre santé financière en temps réel sur 100 points'
                      : 'Evaluates your financial health in real-time out of 100 points'
                    }
                  </p>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-8">
                <h3 className="text-xl font-bold mb-4 text-center">
                  {isFrench ? 'Exemples concrets d\'utilisation :' : 'Real-world examples:'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-yellow-300">
                      {isFrench ? '💡 Scénario Électroménager' : '💡 Appliance Scenario'}
                    </h4>
                    <p className="text-sm text-indigo-100">
                      {isFrench 
                        ? 'Vous voulez un frigo à 2000 $. L\'assistant compare : neuf vs usagé vs financement, et vous dit : "Attendez 2 mois ou choisissez l\'usagé à 400 $ pour éviter un découvert"'
                        : 'You want a $2000 fridge. The assistant compares: new vs used vs financing, and tells you: "Wait 2 months or choose the used one at $400 to avoid an overdraft"'
                      }
                    </p>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-semibold text-green-300">
                      {isFrench ? '🏖️ Scénario Vacances' : '🏖️ Vacation Scenario'}
                    </h4>
                    <p className="text-sm text-indigo-100">
                      {isFrench 
                        ? 'Croisière 8000 $ vs Cuba 2000 $. L\'assistant calcule l\'impact sur votre fonds d\'urgence et recommande : "Cuba maintenant ou croisière dans 6 mois avec plan d\'épargne"'
                        : '$8000 cruise vs $2000 Cuba. The assistant calculates the impact on your emergency fund and recommends: "Cuba now or cruise in 6 months with savings plan"'
                      }
                    </p>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <Button 
                  onClick={() => handleNavigation('/assistant-financier')}
                  size="lg"
                  className="bg-white text-indigo-600 hover:bg-gray-100 font-semibold px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {isFrench ? 'Découvrir l\'Assistant IA' : 'Discover the AI Assistant'}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <p className="text-indigo-200 text-sm mt-3">
                  {isFrench ? 'Disponible dans les plans Professionnel et Expert' : 'Available in Professional and Expert plans'}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Section Planification financière complète */}
          <Card className="bg-white/90 backdrop-blur-sm border-2 border-indigo-200 shadow-2xl mb-12">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold text-indigo-900 mb-4">
                {isFrench ? 'Planification financière complète' : 'Complete financial planning'}
              </CardTitle>
              <p className="text-lg text-gray-700 max-w-4xl mx-auto">
                {isFrench 
                  ? 'Notre plateforme unique vous permet de gérer l\'ensemble de votre planification financière, budgétaire et fiscale pour une retraite sereine et optimisée.'
                  : 'Our unique platform allows you to manage your entire financial, budgetary and tax planning for a serene and optimized retirement.'
                }
              </p>
            </CardHeader>
            <CardContent>
              {/* Section Pourquoi choisir notre solution */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-8">
                <h3 className="text-2xl font-bold text-blue-900 mb-4 text-center">
                  {isFrench ? 'Pourquoi choisir notre solution?' : 'Why choose our solution?'}
                </h3>
                                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-center">
                   <div className="space-y-2">
                     <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                       <CheckCircle className="w-6 h-6 text-white" />
                     </div>
                     <h4 className="font-semibold text-gray-800">
                       {isFrench ? 'Objectifs personnalisés' : 'Personalized goals'}
                     </h4>
                     <p className="text-sm text-gray-600">
                       {isFrench 
                         ? 'Définissez et atteignez vos objectifs selon votre réalité financière'
                         : 'Define and achieve your goals according to your financial reality'
                       }
                     </p>
                   </div>
                   <div className="space-y-2">
                     <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                       <Shield className="w-6 h-6 text-white" />
                     </div>
                     <h4 className="font-semibold text-gray-800">
                       {isFrench ? 'Outils professionnels' : 'Professional tools'}
                     </h4>
                     <p className="text-sm text-gray-600">
                       {isFrench 
                         ? 'Accédez à des outils de planification utilisés par les professionnels'
                         : 'Access planning tools used by professionals'
                       }
                     </p>
                   </div>
                   <div className="space-y-2">
                     <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                       <Heart className="w-6 h-6 text-white" />
                     </div>
                     <h4 className="font-semibold text-gray-800">
                       {isFrench ? 'Contrôle total de vos données' : 'Full control of your data'}
                     </h4>
                     <p className="text-sm text-gray-600">
                       {isFrench 
                         ? 'Vos données restent sur votre appareil. Vous devez les sauvegarder localement - nous ne conservons aucune copie.'
                         : 'Your data stays on your device. You must save it locally - we keep no copies.'
                       }
                     </p>
                   </div>
                   <div className="space-y-2">
                     <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-3">
                       <Heart className="w-6 h-6 text-white" />
                     </div>
                     <h4 className="font-semibold text-gray-800">
                       {isFrench ? 'Santé et bien-être' : 'Health and wellness'}
                     </h4>
                     <p className="text-sm text-gray-600">
                       {isFrench 
                         ? 'Planifiez vos dépenses de santé et maintenez votre qualité de vie'
                         : 'Plan your health expenses and maintain your quality of life'
                       }
                     </p>
                   </div>
                   <div className="space-y-2">
                     <div className="w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center mx-auto mb-3">
                       <Calendar className="w-6 h-6 text-white" />
                     </div>
                     <h4 className="font-semibold text-gray-800">
                       {isFrench ? 'Projets de retraite' : 'Retirement projects'}
                     </h4>
                     <p className="text-sm text-gray-600">
                       {isFrench 
                         ? 'Voyages, loisirs, projets personnels - planifiez tout ce qui vous tient à cœur'
                         : 'Travel, hobbies, personal projects - plan everything that matters to you'
                       }
                     </p>
                   </div>
                   <div className="space-y-2">
                     <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-3">
                       <Home className="w-6 h-6 text-white" />
                     </div>
                     <h4 className="font-semibold text-gray-800">
                       {isFrench ? 'Patrimoine familial' : 'Family heritage'}
                     </h4>
                     <p className="text-sm text-gray-600">
                       {isFrench 
                         ? 'Optimisez la transmission de votre patrimoine à vos proches'
                         : 'Optimize the transmission of your heritage to your loved ones'
                       }
                     </p>
                   </div>
                 </div>
              </div>

                             {/* Fonctionnalités principales - 6 cartes colorées */}
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {/* Gestion du flux de trésorerie */}
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 hover:shadow-lg transition-all duration-300">
                  <CardHeader className="text-center pb-4">
                    <div className="w-16 h-16 bg-blue-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <BarChart3 className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-lg font-bold text-blue-900">
                      {isFrench ? 'Gestion du flux de trésorerie' : 'Cashflow management'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-blue-700 text-center">
                      {isFrench 
                        ? 'Analysez et optimisez vos flux de trésorerie pour maximiser vos économies'
                        : 'Analyze and optimize your cash flows to maximize your savings'
                      }
                    </p>
                  </CardContent>
                </Card>

                {/* Stratégies de décaissement */}
                <Card className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 hover:shadow-lg transition-all duration-300">
                  <CardHeader className="text-center pb-4">
                    <div className="w-16 h-16 bg-green-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <TrendingUp className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-lg font-bold text-green-900">
                      {isFrench ? 'Stratégies de décaissement' : 'Withdrawal strategies'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-green-700 text-center">
                      {isFrench 
                        ? 'Développez des stratégies optimales pour maximiser la durée de vie de votre épargne'
                        : 'Develop optimal strategies to maximize the lifespan of your savings'
                      }
                    </p>
                  </CardContent>
                </Card>

                {/* Planification des dépenses */}
                <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200 hover:shadow-lg transition-all duration-300">
                  <CardHeader className="text-center pb-4">
                    <div className="w-16 h-16 bg-purple-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <Calendar className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-lg font-bold text-purple-900">
                      {isFrench ? 'Planification des dépenses' : 'Expense planning'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-purple-700 text-center">
                      {isFrench 
                        ? 'Planifiez vos dépenses futures et ajustez votre budget selon vos objectifs'
                        : 'Plan your future expenses and adjust your budget according to your goals'
                      }
                    </p>
                  </CardContent>
                </Card>

                                 {/* Optimisation fiscale */}
                 <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-200 hover:shadow-lg transition-all duration-300">
                   <CardHeader className="text-center pb-4">
                     <div className="w-16 h-16 bg-orange-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                       <Zap className="w-8 h-8 text-white" />
                     </div>
                     <CardTitle className="text-lg font-bold text-orange-900">
                       {isFrench ? 'Optimisation fiscale' : 'Tax optimization'}
                     </CardTitle>
                   </CardHeader>
                   <CardContent>
                     <p className="text-sm text-orange-700 text-center">
                       {isFrench 
                         ? 'Optimisez vos impôts et maximisez vos économies grâce à nos outils avancés'
                         : 'Optimize your taxes and maximize your savings with our advanced tools'
                       }
                     </p>
                   </CardContent>
                 </Card>

                 {/* Simulations Monte Carlo */}
                 <Card className="bg-gradient-to-br from-sky-50 to-sky-100 border-2 border-sky-200 hover:shadow-lg transition-all duration-300">
                   <CardHeader className="text-center pb-4">
                     <div className="w-16 h-16 bg-sky-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                       <Crown className="w-8 h-8 text-white" />
                     </div>
                     <CardTitle className="text-lg font-bold text-sky-900">
                       {isFrench ? 'Simulations Monte Carlo' : 'Monte Carlo simulations'}
                     </CardTitle>
                   </CardHeader>
                   <CardContent>
                     <p className="text-sm text-sky-700 text-center">
                       {isFrench 
                         ? 'Évaluez la robustesse de votre plan face aux incertitudes du marché'
                         : 'Evaluate the robustness of your plan against market uncertainties'
                       }
                     </p>
                   </CardContent>
                 </Card>

                 {/* Conseils personnalisés par IA */}
                 <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-2 border-emerald-200 hover:shadow-lg transition-all duration-300">
                   <CardHeader className="text-center pb-4">
                     <div className="w-16 h-16 bg-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                       <Sparkles className="w-8 h-8 text-white" />
                     </div>
                     <CardTitle className="text-lg font-bold text-emerald-900">
                       {isFrench ? 'Conseils personnalisés par IA' : 'AI-powered personal advice'}
                     </CardTitle>
                   </CardHeader>
                   <CardContent>
                     <p className="text-sm text-emerald-700 text-center">
                       {isFrench 
                         ? 'Recevez des recommandations intelligentes pour affiner votre stratégie'
                         : 'Receive intelligent recommendations to refine your strategy'
                       }
                     </p>
                   </CardContent>
                 </Card>
               </div>
            </CardContent>
          </Card>

          {/* Fonctionnalités de votre forfait - Déplacé depuis Vue d'ensemble */}
          <Card className="bg-gradient-to-br from-blue-800/90 to-indigo-800/90 border-0 shadow-2xl backdrop-blur-sm mb-12">
            <CardHeader className="border-b border-blue-600 bg-gradient-to-r from-blue-600/20 to-indigo-600/20">
              <CardTitle className="text-2xl font-bold text-blue-300 flex items-center gap-3">
                <Crown className="w-8 h-8" />
                {isFrench ? 'Fonctionnalités de votre forfait' : 'Features of your Plan'}
              </CardTitle>
              <p className="text-blue-200">
                {isFrench ? 'Forfait actuel : Gratuit' : 'Current plan: Free'}
              </p>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Planification de base */}
                <Card className="bg-gradient-to-br from-green-600/20 to-green-500/20 border border-green-500/30 shadow-lg">
                  <CardContent className="p-6 text-center">
                    <Target className="w-12 h-12 text-green-400 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-green-300 mb-2">
                      {isFrench ? 'Planification de base' : 'Basic Planning'}
                    </h3>
                    <p className="text-green-200">
                      {isFrench ? 'Outils essentiels de planification' : 'Essential planning tools'}
                    </p>
                  </CardContent>
                </Card>

                {/* Gestion du profil */}
                <Card className="bg-gradient-to-br from-blue-600/20 to-blue-500/20 border border-blue-500/30 shadow-lg">
                  <CardContent className="p-6 text-center">
                    <Users className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-blue-300 mb-2">
                      {isFrench ? 'Gestion du profil' : 'Profile Management'}
                    </h3>
                    <p className="text-blue-200">
                      {isFrench ? 'Gestion des données personnelles' : 'Personal data management'}
                    </p>
                  </CardContent>
                </Card>

                {/* Calculs de base */}
                <Card className="bg-gradient-to-br from-purple-600/20 to-purple-500/20 border border-purple-500/30 shadow-lg">
                  <CardContent className="p-6 text-center">
                    <Calculator className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-purple-300 mb-2">
                      {isFrench ? 'Calculs de base' : 'Basic Calculations'}
                    </h3>
                    <p className="text-purple-200">
                      {isFrench ? 'Calculs de retraite fondamentaux' : 'Fundamental retirement calculations'}
                    </p>
                  </CardContent>
                </Card>

                {/* Gestion de l'épargne */}
                <Card className="bg-gradient-to-br from-orange-600/20 to-orange-500/20 border border-orange-500/30 shadow-lg">
                  <CardContent className="p-6 text-center">
                    <Shield className="w-12 h-12 text-orange-400 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-orange-300 mb-2">
                      {isFrench ? 'Gestion de l\'épargne' : 'Savings Management'}
                    </h3>
                    <p className="text-orange-200">
                      {isFrench ? 'Suivez vos progrès d\'épargne' : 'Track your savings progress'}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Boutons d'upgrade */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Button
                  onClick={() => handleUpgradeClick('professional')}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold text-lg py-4 shadow-2xl transform hover:scale-105 transition-all duration-300"
                  size="lg"
                >
                  <Crown className="w-6 h-6 mr-3" />
                  {isFrench ? 'Passer au forfait Professional' : 'Upgrade to Professional Plan'}
                  <ArrowRight className="w-6 h-6 ml-3" />
                </Button>
                <Button
                  onClick={() => handleUpgradeClick('ultimate')}
                  className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold text-lg py-4 shadow-2xl transform hover:scale-105 transition-all duration-300"
                  size="lg"
                >
                  <TrendingUp className="w-6 h-6 mr-3" />
                  {isFrench ? 'Passer au forfait Expert' : 'Upgrade to Expert Plan'}
                  <ArrowRight className="w-6 h-6 ml-3" />
                </Button>
              </div>

              <div className="mt-6 text-center">
                <p className="text-blue-200 text-sm">
                  {isFrench 
                    ? 'Débloquez les simulations illimitées et fonctionnalités avancées'
                    : 'Unlock unlimited simulations and advanced features'
                  }
                </p>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>






      







      {/* Section Comparaison des plans - TABLEAU ORIGINAL */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-4">
                {isFrench ? 'Comparaison des plans' : 'Plan Comparison'}
              </h2>
              <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                {isFrench 
                  ? 'Découvrez ce qui est inclus dans chaque plan et choisissez celui qui correspond à vos besoins'
                  : 'Discover what is included in each plan and choose the one that fits your needs'
                }
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
              {/* En-têtes des plans */}
              <div className="grid grid-cols-4 bg-gray-50 border-b border-gray-200">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {isFrench ? 'Fonctionnalité' : 'Feature'}
                  </h3>
                </div>
                <div className="p-6 text-center border-l border-gray-200">
                  <div className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium mb-2">
                    {isFrench ? 'Gratuit' : 'Free'}
                  </div>
                  <div className="text-2xl font-bold text-gray-900">0 $</div>
                </div>
                <div className="p-6 text-center border-l border-gray-200 bg-blue-50">
                  <div className="inline-block bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium mb-2">
                    {isFrench ? 'Recommandé' : 'Recommended'}
                  </div>
                  <div className="inline-block bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium mb-2">
                    Professional
                  </div>
                  <div className="text-2xl font-bold text-blue-900">119,99 $</div>
                  <div className="text-sm text-blue-600">{isFrench ? '/an' : '/year'}</div>
                </div>
                <div className="p-6 text-center border-l border-gray-200 bg-purple-50">
                  <div className="inline-block bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium mb-2">
                    Ultimate
                  </div>
                  <div className="text-2xl font-bold text-purple-900">239,99 $</div>
                  <div className="text-sm text-purple-600">{isFrench ? '/an' : '/year'}</div>
                </div>
              </div>

              {/* Lignes de fonctionnalités */}
              {[
                { name: isFrench ? 'Planification de base' : 'Basic planning', free: true, pro: true, ultimate: true },
                { name: isFrench ? 'Gestion du profil personnel' : 'Personal profile management', free: true, pro: true, ultimate: true },
                { name: isFrench ? 'Calculs de retraite de base' : 'Basic retirement calculations', free: true, pro: true, ultimate: true },
                { name: isFrench ? 'Gestion de l\'épargne' : 'Savings management', free: true, pro: true, ultimate: true },
                { name: isFrench ? 'Gestion du cashflow' : 'Cashflow management', free: true, pro: true, ultimate: true },
                { name: isFrench ? 'Projets de dépenses' : 'Expense projects', free: true, pro: true, ultimate: true },
                { name: isFrench ? 'Stratégies de décaissement' : 'Withdrawal strategies', free: false, pro: true, ultimate: true },
                { name: isFrench ? 'Simulations Monte Carlo' : 'Monte Carlo simulations', free: false, pro: true, ultimate: true },
                { name: isFrench ? 'Optimisation fiscale' : 'Tax optimization', free: false, pro: true, ultimate: true },
                { name: isFrench ? 'Conseils personnalisés par IA' : 'AI personalized advice', free: false, pro: false, ultimate: true },
                { name: isFrench ? 'Rapports détaillés' : 'Detailed reports', free: false, pro: false, ultimate: true },
                { name: isFrench ? 'Export PDF' : 'PDF export', free: false, pro: false, ultimate: true },
                { name: isFrench ? 'Support prioritaire' : 'Priority support', free: false, pro: false, ultimate: true }
              ].map((feature, index) => (
                <div key={index} className={`grid grid-cols-4 border-b border-gray-100 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                  <div className="p-4 font-medium text-gray-900">
                    {feature.name}
                  </div>
                  <div className="p-4 text-center border-l border-gray-200">
                    {feature.free ? (
                      <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-400 mx-auto" />
                    )}
                  </div>
                  <div className="p-4 text-center border-l border-gray-200 bg-blue-50">
                    {feature.pro ? (
                      <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-400 mx-auto" />
                    )}
                  </div>
                  <div className="p-4 text-center border-l border-gray-200 bg-purple-50">
                    {feature.ultimate ? (
                      <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-400 mx-auto" />
                    )}
                  </div>
                </div>
              ))}

              {/* Boutons d'action */}
              <div className="grid grid-cols-4 bg-gray-50 p-6">
                <div></div>
                <div className="text-center">
                  <Button 
                    variant="outline" 
                    className="w-full"
                    disabled
                  >
                    {isFrench ? 'Commencer gratuitement' : 'Start for free'}
                  </Button>
                </div>
                <div className="text-center">
                  <Button 
                    onClick={() => handleUpgradeClick('professional')}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                  >
                    {isFrench ? 'Choisir Professional' : 'Choose Professional'}
                  </Button>
                </div>
                <div className="text-center">
                  <Button 
                    onClick={() => handleUpgradeClick('ultimate')}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold"
                  >
                    {isFrench ? 'Choisir Expert' : 'Choose Expert'}
                  </Button>
                </div>
              </div>
            </div>

            <div className="text-center mt-8">
              <p className="text-blue-100 text-sm">
                ✨ {isFrench 
                  ? 'Tous les plans incluent une garantie de remboursement de 30 jours'
                  : 'All plans include a 30-day money-back guarantee'
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Section Avertissement important - Déplacée depuis Planification Retraite */}
      <div className="bg-yellow-50 border-l-4 border-yellow-400 rounded-2xl mx-6 mb-12 shadow-lg">
        <div className="container mx-auto px-8 py-8">
          <div className="flex items-start gap-4">
            <AlertTriangle className="w-8 h-8 text-yellow-600 mt-1 flex-shrink-0" />
            <div>
              <h3 className="text-xl font-bold text-yellow-800 mb-4">
                {isFrench ? 'Avertissement important' : 'Important warning'}
              </h3>
              <p className="text-yellow-700 mb-6">
                {isFrench 
                  ? 'Cette plateforme de planification financière est un outil éducatif et informatif qui ne remplace en aucun cas une consultation avec un professionnel qualifié.'
                  : 'This financial planning platform is an educational and informative tool that in no way replaces a consultation with a qualified professional.'
                }
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-semibold text-yellow-800 mb-3">
                    {isFrench ? 'VOS RESPONSABILITÉS :' : 'YOUR RESPONSIBILITIES:'}
                  </h4>
                  <ul className="space-y-2 text-sm text-yellow-700">
                    <li>• {isFrench 
                      ? 'Consultez un planificateur financier autorisé pour les décisions importantes'
                      : 'Consult an authorized financial planner for important decisions'
                    }</li>
                    <li>• {isFrench 
                      ? 'Vérifiez la validité fiscale de vos stratégies avec un comptable qualifié'
                      : 'Verify the tax validity of your strategies with a qualified accountant'
                    }</li>
                    <li>• {isFrench 
                      ? 'Obtenez des conseils juridiques pour la planification successorale'
                      : 'Obtain legal advice for estate planning'
                    }</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-yellow-800 mb-3">
                    {isFrench ? 'AVANTAGES DE NOTRE SOLUTION :' : 'ADVANTAGES OF OUR SOLUTION:'}
                  </h4>
                  <ul className="space-y-2 text-sm text-yellow-700">
                    <li>• {isFrench 
                      ? "Gagnez du temps en préparant vos données à l'avance"
                      : 'Save time by preparing your data in advance'
                    }</li>
                    <li>• {isFrench 
                      ? 'Réduisez le nombre de rencontres avec vos conseillers'
                      : 'Reduce the number of meetings with your advisors'
                    }</li>
                    <li>• {isFrench 
                      ? 'Améliorez le contrôle de vos finances avec des outils professionnels'
                      : 'Improve control of your finances with professional tools'
                    }</li>
                    <li>• {isFrench 
                      ? 'Optimisez vos consultations à une meilleure compréhension'
                      : 'Optimize your consultations for better understanding'
                    }</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal d'upgrade */}
      <AdvancedUpgradeModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
        requiredPlan={targetPlan}
        featureName="plan_upgrade"
        currentPlan="free"
      />

    </div>
  );
};

export default Accueil;
