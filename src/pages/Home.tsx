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
  Home as HomeIcon,
  Rocket,
  Phone,
  FileText,
  Users,
  Target
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';


const Home: React.FC = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const isFrench = language === 'fr';

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      
      {/* Main content - Directly financial planning */}
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-6xl mx-auto">

          {/* NEW - Free Service Section - Family Protection Kit */}
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
                  {isFrench ? 'Kit de Protection Familiale' : 'Family Protection Kit'}
                </h2>
                <p className="text-xl text-emerald-100 max-w-4xl mx-auto mb-8">
                  {isFrench 
                    ? 'Protégez vos proches avec un plan d\'urgence complet. Le premier pas essentiel avant de rencontrer un professionnel.'
                    : 'Protect your loved ones with a comprehensive emergency plan. The essential first step before meeting a professional.'
                  }
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
                  {isFrench ? 'Pourquoi commencer par ici ?' : 'Why start here?'}
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
                  onClick={() => handleNavigation('/emergency-planning')}
                  size="lg"
                  className="bg-white text-emerald-600 hover:bg-gray-100 font-bold px-12 py-4 text-xl rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  {isFrench ? '🎯 Créer mon Kit GRATUIT' : '🎯 Create my FREE Kit'}
                  <ArrowRight className="ml-3 w-6 h-6" />
                </Button>
                <p className="text-emerald-200 text-sm mt-4">
                  {isFrench ? '✨ Aucune inscription requise • Données 100% privées' : '✨ No registration required • 100% private data'}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Section Your retirement, your story */}
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

            {/* Section Our commitment */}
            <Card className="bg-white/90 backdrop-blur-sm border-2 border-blue-200 shadow-xl mb-8">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl font-bold text-blue-900 flex items-center justify-center gap-3">
                  <Shield className="w-6 h-6 text-blue-600" />
                  {isFrench ? 'Notre engagement' : 'Our commitment'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* What we recognize */}
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

                  {/* What we offer */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      {isFrench ? 'Ce que nous offrons :' : 'What we offer:'}
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <p className="text-gray-700">
                          {isFrench 
                            ? 'Un accompagnement bienveillant et sans jugement'
                            : 'Caring and non-judgmental support'
                          }
                        </p>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <p className="text-gray-700">
                          {isFrench 
                            ? 'Des outils adaptés à votre situation réelle'
                            : 'Tools adapted to your real situation'
                          }
                        </p>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <p className="text-gray-700">
                          {isFrench 
                            ? 'Une approche progressive et accessible'
                            : 'A progressive and accessible approach'
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Call to action */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => handleNavigation('/en/retirement-module')}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {isFrench ? 'Commencer ma planification' : 'Start my planning'}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button 
                variant="outline"
                onClick={() => handleNavigation('/my-profile')}
                className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-3 text-lg font-semibold rounded-lg transition-all duration-300"
              >
                {isFrench ? 'Mon profil' : 'My profile'}
              </Button>
            </div>
          </div>

          {/* Section Why choose us */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              {isFrench ? 'Pourquoi nous choisir ?' : 'Why choose us?'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Card 1 */}
              <Card className="bg-white/90 backdrop-blur-sm border-2 border-green-200 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="w-8 h-8 text-green-600" />
                  </div>
                  <CardTitle className="text-xl font-bold text-green-800">
                    {isFrench ? 'Approche humaine' : 'Human approach'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-700">
                    {isFrench 
                      ? 'Nous comprenons que chaque situation est unique et mérite une attention personnalisée.'
                      : 'We understand that every situation is unique and deserves personalized attention.'
                    }
                  </p>
                </CardContent>
              </Card>

              {/* Card 2 */}
              <Card className="bg-white/90 backdrop-blur-sm border-2 border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-8 h-8 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl font-bold text-blue-800">
                    {isFrench ? 'Sécurité et confidentialité' : 'Security and privacy'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-700">
                    {isFrench 
                      ? 'Vos données sont protégées et restent strictement confidentielles.'
                      : 'Your data is protected and remains strictly confidential.'
                    }
                  </p>
                </CardContent>
              </Card>

              {/* Card 3 */}
              <Card className="bg-white/90 backdrop-blur-sm border-2 border-purple-200 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Zap className="w-8 h-8 text-purple-600" />
                  </div>
                  <CardTitle className="text-xl font-bold text-purple-800">
                    {isFrench ? 'Simplicité d\'utilisation' : 'Ease of use'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-700">
                    {isFrench 
                      ? 'Des outils intuitifs qui s\'adaptent à votre niveau de connaissances.'
                      : 'Intuitive tools that adapt to your knowledge level.'
                    }
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Section Features */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              {isFrench ? 'Fonctionnalités principales' : 'Main features'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left column */}
              <div className="space-y-6">
                <Card className="bg-white/90 backdrop-blur-sm border-2 border-orange-200 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-orange-800">
                      <BarChart3 className="w-6 h-6" />
                      {isFrench ? 'Planification personnalisée' : 'Personalized planning'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700">
                      {isFrench 
                        ? 'Créez un plan de retraite adapté à vos objectifs et à votre situation financière actuelle.'
                        : 'Create a retirement plan adapted to your goals and current financial situation.'
                      }
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-white/90 backdrop-blur-sm border-2 border-green-200 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-green-800">
                      <TrendingUp className="w-6 h-6" />
                      {isFrench ? 'Suivi des progrès' : 'Progress tracking'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700">
                      {isFrench 
                        ? 'Visualisez vos progrès et ajustez votre plan selon vos besoins.'
                        : 'Visualize your progress and adjust your plan according to your needs.'
                      }
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Right column */}
              <div className="space-y-6">
                <Card className="bg-white/90 backdrop-blur-sm border-2 border-blue-200 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-blue-800">
                      <Calendar className="w-6 h-6" />
                      {isFrench ? 'Gestion des objectifs' : 'Goal management'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700">
                      {isFrench 
                        ? 'Définissez et suivez vos objectifs financiers à court et long terme.'
                        : 'Define and track your short and long-term financial goals.'
                      }
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-white/90 backdrop-blur-sm border-2 border-purple-200 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-purple-800">
                      <Sparkles className="w-6 h-6" />
                      {isFrench ? 'Recommandations intelligentes' : 'Smart recommendations'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700">
                      {isFrench 
                        ? 'Recevez des suggestions personnalisées pour optimiser votre plan.'
                        : 'Receive personalized suggestions to optimize your plan.'
                      }
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* Section Final CTA */}
          <div className="text-center">
            <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 shadow-2xl">
              <CardHeader className="text-center">
                <CardTitle className="text-3xl font-bold flex items-center justify-center gap-3">
                  <Crown className="w-8 h-8" />
                  {isFrench ? 'Prêt à prendre le contrôle ?' : 'Ready to take control?'}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-xl mb-6 opacity-90">
                  {isFrench 
                    ? 'Commencez dès aujourd\'hui votre voyage vers la liberté financière.'
                    : 'Start your journey to financial freedom today.'
                  }
                </p>
                <Button 
                  onClick={() => handleNavigation('/en/retirement-module')}
                  className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {isFrench ? 'Commencer maintenant' : 'Start now'}
                  <Rocket className="ml-2 w-5 h-5" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
