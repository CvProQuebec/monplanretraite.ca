import React, { useState } from 'react';
import { useLanguage } from '@/features/retirement/hooks/useLanguage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle,
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
  Home
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';


const Accueil: React.FC = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const isFrench = language === 'fr';

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">

      
      {/* Contenu principal - Directement la planification financière */}
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-6xl mx-auto">

          {/* Section Votre retraite, votre histoire */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <Heart className="w-8 h-8 text-red-500" />
              </div>
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {isFrench ? 'Votre retraite, votre histoire' : 'Your retirement, your story'}
            </h2>
            <p className="text-xl text-gray-700 max-w-4xl mx-auto mb-12">
              {isFrench 
                ? 'Chaque personne mérite de planifier son avenir avec dignité, peu importe son niveau d\'épargne actuel.'
                : 'Every person deserves to plan their future with dignity, regardless of their current savings level.'
              }
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

            {/* Section Vous n'êtes plus seul(e) */}
            <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 shadow-xl mb-12">
              <CardContent className="p-8 text-center">
                <div className="flex justify-center mb-4">
                  <Heart className="w-8 h-8 text-pink-500" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {isFrench ? 'Vous n\'êtes plus seul(e)' : 'You are no longer alone'}
                </h3>
                <p className="text-lg text-gray-700 mb-6 max-w-2xl mx-auto">
                  {isFrench 
                    ? 'Chaque petit pas compte vers votre sécurité financière. Commencez votre voyage avec bienveillance.'
                    : 'Every small step counts towards your financial security. Start your journey with kindness.'
                  }
                </p>
                <Button 
                  onClick={() => handleNavigation('/mon-profil')}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 mx-auto"
                >
                  {isFrench ? 'Commencer maintenant' : 'Start now'}
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </CardContent>
            </Card>
          </div>

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
                  {isFrench ? 'Pourquoi choisir notre solution ?' : 'Why choose our solution?'}
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
                       {isFrench ? 'Sécurité garantie' : 'Guaranteed security'}
                     </h4>
                     <p className="text-sm text-gray-600">
                       {isFrench 
                         ? 'Vos données sont protégées selon les plus hauts standards'
                         : 'Your data is protected according to the highest standards'
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

          {/* Section de comparaison des plans */}
          <Card className="bg-white/90 backdrop-blur-sm border-2 border-gray-200 shadow-2xl mb-12">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold text-gray-900 mb-4">
                {isFrench ? 'Comparaison des plans' : 'Plan comparison'}
              </CardTitle>
              <p className="text-lg text-gray-700">
                {isFrench 
                  ? 'Découvrez le plan qui correspond le mieux à vos besoins et commencez votre planification'
                  : 'Discover the plan that best suits your needs and start your planning'
                }
              </p>
            </CardHeader>
            <CardContent>
              {/* Tableau détaillé des fonctionnalités */}
              <div className="mb-8">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b-2 border-gray-200">
                        <th className="text-left p-4 font-semibold text-gray-800">
                          {isFrench ? 'Fonctionnalité' : 'Feature'}
                        </th>
                        <th className="text-center p-4 font-semibold text-gray-800">
                          <div>{isFrench ? 'Gratuit' : 'Free'}</div>
                          <div className="text-sm font-normal text-gray-600">0 $</div>
                          <div className="text-xs text-gray-500">{isFrench ? 'Pour toujours' : 'Forever'}</div>
                        </th>
                        <th className="text-center p-4 font-semibold text-gray-800">
                          <div>{isFrench ? 'Professionnel' : 'Professional'}</div>
                          <div className="text-sm font-normal text-blue-600">119,99 $</div>
                          <div className="text-xs text-blue-500">{isFrench ? '/an' : '/year'}</div>
                        </th>
                        <th className="text-center p-4 font-semibold text-gray-800">
                          <div>{isFrench ? 'Ultimate' : 'Ultimate'}</div>
                          <div className="text-sm font-normal text-purple-600">239,99 $</div>
                          <div className="text-xs text-purple-500">{isFrench ? '/an' : '/year'}</div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-100">
                        <td className="p-4 text-gray-700">{isFrench ? 'Planification de base' : 'Basic planning'}</td>
                        <td className="p-4 text-center"><CheckCircle className="w-5 h-5 text-green-600 mx-auto" /></td>
                        <td className="p-4 text-center"><CheckCircle className="w-5 h-5 text-green-600 mx-auto" /></td>
                        <td className="p-4 text-center"><CheckCircle className="w-5 h-5 text-green-600 mx-auto" /></td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="p-4 text-gray-700">{isFrench ? 'Gestion du profil personnel' : 'Personal profile management'}</td>
                        <td className="p-4 text-center"><CheckCircle className="w-5 h-5 text-green-600 mx-auto" /></td>
                        <td className="p-4 text-center"><CheckCircle className="w-5 h-5 text-green-600 mx-auto" /></td>
                        <td className="p-4 text-center"><CheckCircle className="w-5 h-5 text-green-600 mx-auto" /></td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="p-4 text-gray-700">{isFrench ? 'Calculs de retraite de base' : 'Basic retirement calculations'}</td>
                        <td className="p-4 text-center"><CheckCircle className="w-5 h-5 text-green-600 mx-auto" /></td>
                        <td className="p-4 text-center"><CheckCircle className="w-5 h-5 text-green-600 mx-auto" /></td>
                        <td className="p-4 text-center"><CheckCircle className="w-5 h-5 text-green-600 mx-auto" /></td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="p-4 text-gray-700">{isFrench ? 'Gestion de l\'épargne' : 'Savings management'}</td>
                        <td className="p-4 text-center"><CheckCircle className="w-5 h-5 text-green-600 mx-auto" /></td>
                        <td className="p-4 text-center"><CheckCircle className="w-5 h-5 text-green-600 mx-auto" /></td>
                        <td className="p-4 text-center"><CheckCircle className="w-5 h-5 text-green-600 mx-auto" /></td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="p-4 text-gray-700">{isFrench ? 'Gestion du cashflow' : 'Cashflow management'}</td>
                        <td className="p-4 text-center"><CheckCircle className="w-5 h-5 text-green-600 mx-auto" /></td>
                        <td className="p-4 text-center"><CheckCircle className="w-5 h-5 text-green-600 mx-auto" /></td>
                        <td className="p-4 text-center"><CheckCircle className="w-5 h-5 text-green-600 mx-auto" /></td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="p-4 text-gray-700">{isFrench ? 'Projets de dépenses' : 'Expense projects'}</td>
                        <td className="p-4 text-center"><CheckCircle className="w-5 h-5 text-green-600 mx-auto" /></td>
                        <td className="p-4 text-center"><CheckCircle className="w-5 h-5 text-green-600 mx-auto" /></td>
                        <td className="p-4 text-center"><CheckCircle className="w-5 h-5 text-green-600 mx-auto" /></td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="p-4 text-gray-700">{isFrench ? 'Stratégies de décaissement' : 'Withdrawal strategies'}</td>
                        <td className="p-4 text-center"><div className="w-5 h-5 border-2 border-red-500 rounded-full mx-auto flex items-center justify-center"><span className="text-red-500 text-xs font-bold">×</span></div></td>
                        <td className="p-4 text-center"><CheckCircle className="w-5 h-5 text-green-600 mx-auto" /></td>
                        <td className="p-4 text-center"><CheckCircle className="w-5 h-5 text-green-600 mx-auto" /></td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="p-4 text-gray-700">{isFrench ? 'Simulations Monte Carlo' : 'Monte Carlo simulations'}</td>
                        <td className="p-4 text-center"><div className="w-5 h-5 border-2 border-red-500 rounded-full mx-auto flex items-center justify-center"><span className="text-red-500 text-xs font-bold">×</span></div></td>
                        <td className="p-4 text-center"><CheckCircle className="w-5 h-5 text-green-600 mx-auto" /></td>
                        <td className="p-4 text-center"><CheckCircle className="w-5 h-5 text-green-600 mx-auto" /></td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="p-4 text-gray-700">{isFrench ? 'Optimisation fiscale' : 'Tax optimization'}</td>
                        <td className="p-4 text-center"><div className="w-5 h-5 border-2 border-red-500 rounded-full mx-auto flex items-center justify-center"><span className="text-red-500 text-xs font-bold">×</span></div></td>
                        <td className="p-4 text-center"><CheckCircle className="w-5 h-5 text-green-600 mx-auto" /></td>
                        <td className="p-4 text-center"><CheckCircle className="w-5 h-5 text-green-600 mx-auto" /></td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="p-4 text-gray-700">{isFrench ? 'Conseils personnalisés par IA' : 'AI-powered personal advice'}</td>
                        <td className="p-4 text-center"><div className="w-5 h-5 border-2 border-red-500 rounded-full mx-auto flex items-center justify-center"><span className="text-red-500 text-xs font-bold">×</span></div></td>
                        <td className="p-4 text-center"><div className="w-5 h-5 border-2 border-red-500 rounded-full mx-auto flex items-center justify-center"><span className="text-red-500 text-xs font-bold">×</span></div></td>
                        <td className="p-4 text-center"><CheckCircle className="w-5 h-5 text-green-600 mx-auto" /></td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="p-4 text-gray-700">{isFrench ? 'Rapports détaillés' : 'Detailed reports'}</td>
                        <td className="p-4 text-center"><div className="w-5 h-5 border-2 border-red-500 rounded-full mx-auto flex items-center justify-center"><span className="text-red-500 text-xs font-bold">×</span></div></td>
                        <td className="p-4 text-center"><div className="w-5 h-5 border-2 border-red-500 rounded-full mx-auto flex items-center justify-center"><span className="text-red-500 text-xs font-bold">×</span></div></td>
                        <td className="p-4 text-center"><CheckCircle className="w-5 h-5 text-green-600 mx-auto" /></td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="p-4 text-gray-700">{isFrench ? 'Export PDF' : 'PDF Export'}</td>
                        <td className="p-4 text-center"><div className="w-5 h-5 border-2 border-red-500 rounded-full mx-auto flex items-center justify-center"><span className="text-red-500 text-xs font-bold">×</span></div></td>
                        <td className="p-4 text-center"><div className="w-5 h-5 border-2 border-red-500 rounded-full mx-auto flex items-center justify-center"><span className="text-red-500 text-xs font-bold">×</span></div></td>
                        <td className="p-4 text-center"><CheckCircle className="w-5 h-5 text-green-600 mx-auto" /></td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="p-4 text-gray-700">{isFrench ? 'Support prioritaire' : 'Priority support'}</td>
                        <td className="p-4 text-center"><div className="w-5 h-5 border-2 border-red-500 rounded-full mx-auto flex items-center justify-center"><span className="text-red-500 text-xs font-bold">×</span></div></td>
                        <td className="p-4 text-center"><div className="w-5 h-5 border-2 border-red-500 rounded-full mx-auto flex items-center justify-center"><span className="text-red-500 text-xs font-bold">×</span></div></td>
                        <td className="p-4 text-center"><CheckCircle className="w-5 h-5 text-green-600 mx-auto" /></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Boutons d'action */}
              <div className="flex flex-col md:flex-row gap-4 justify-center">
                <Button 
                  variant="outline" 
                  size="lg" 
                  onClick={() => handleNavigation('/mon-profil')}
                  className="flex-1 max-w-xs"
                >
                  {isFrench ? 'Commencer gratuitement' : 'Start for free'}
                </Button>
                <Button 
                  size="lg" 
                  className="flex-1 max-w-xs bg-blue-600 hover:bg-blue-700"
                >
                  {isFrench ? 'Choisir Professionnel' : 'Choose Professional'}
                </Button>
                <Button 
                  size="lg" 
                  className="flex-1 max-w-xs bg-purple-600 hover:bg-purple-700"
                >
                  {isFrench ? 'Choisir Ultimate' : 'Choose Ultimate'}
                </Button>
              </div>
            </CardContent>
          </Card>
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

      {/* Section finale - Call to action avec code promo - Déplacée depuis Planification Retraite */}
      <div className="text-center pb-16">
        <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-3xl mx-6 p-12 text-white shadow-2xl">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl font-bold text-green-600">M</span>
          </div>
          <h2 className="text-3xl font-bold mb-4">
            {isFrench ? 'Bienvenue Gerald Dore !' : 'Welcome Gerald Dore!'}
          </h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            {isFrench 
              ? 'Avec notre code promo : Débloquez des fonctionnalités supplémentaires !'
              : 'With our promo code: Unlock additional features!'
            }
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
            <input 
              type="text" 
              placeholder={isFrench ? 'Entrez votre code promo' : 'Enter your promo code'}
              className="flex-1 px-4 py-3 rounded-lg text-gray-800 border-0 focus:ring-2 focus:ring-white"
            />
            <Button 
              size="lg"
              className="bg-white text-green-600 hover:bg-gray-100 font-semibold px-8"
            >
              {isFrench ? 'Appliquer' : 'Apply'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Accueil;
