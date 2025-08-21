import React from 'react';
import { useLanguage } from '@/features/retirement/hooks/useLanguage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Heart, 
  Shield, 
  Users, 
  Star, 
  ArrowRight,
  CheckCircle,
  TrendingUp,
  Target
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SeniorsNavigationHeader from '@/components/layout/header/SeniorsNavigationHeader';

const Accueil: React.FC = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();

  const isFrench = language === 'fr';

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation seniors intégrée */}
      <SeniorsNavigationHeader />
      
      {/* Hero Section - Message d'accueil chaleureux */}
      <div className="container mx-auto px-6 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Heart className="w-20 h-20 text-red-500 mx-auto mb-6 animate-pulse" />
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              {isFrench ? 'Votre retraite, votre histoire' : 'Your retirement, your story'}
            </h1>
            <p className="text-2xl text-gray-700 leading-relaxed mb-8">
              {isFrench 
                ? 'Chaque personne mérite de planifier son avenir avec dignité, peu importe son niveau d\'épargne actuel.'
                : 'Every person deserves to plan their future with dignity, regardless of their current savings level.'
              }
            </p>
          </div>

          {/* Notre engagement */}
          <Card className="bg-white/80 backdrop-blur-sm border-2 border-blue-200 shadow-xl mb-12">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-blue-800 flex items-center justify-center gap-3">
                <Shield className="w-8 h-8" />
                {isFrench ? 'Notre engagement' : 'Our commitment'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    {isFrench ? 'Ce que nous reconnaissons :' : 'What we recognize:'}
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-gray-700">
                        {isFrench 
                          ? 'Le stress financier peut être angoissant'
                          : 'Financial stress can be overwhelming'
                        }
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-gray-700">
                        {isFrench 
                          ? 'Le sentiment d\'abandon face à la complexité'
                          : 'The feeling of abandonment in the face of complexity'
                        }
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-gray-700">
                        {isFrench 
                          ? 'Les barrières économiques traditionnelles'
                          : 'Traditional economic barriers'
                        }
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    {isFrench ? 'Notre promesse :' : 'Our promise:'}
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <p className="text-gray-700">
                        {isFrench 
                          ? 'Accessibilité pour tous, pas seulement les fortunés'
                          : 'Accessibility for all, not just the wealthy'
                        }
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <p className="text-gray-700">
                        {isFrench 
                          ? 'Bienveillance sans jugement ni pression'
                          : 'Kindness without judgment or pressure'
                        }
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
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

          {/* Navigation vers les 4 sections principales */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {/* ACCUEIL */}
            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transition-all duration-300 cursor-pointer transform hover:scale-105" onClick={() => handleNavigation('/')}>
              <CardHeader className="text-center pb-3">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Star className="w-8 h-8" />
                </div>
                <CardTitle className="text-lg">
                  {isFrench ? 'Accueil' : 'Home'}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center pt-0">
                <p className="text-blue-100 text-sm">
                  {isFrench 
                    ? 'Vue d\'ensemble et progression'
                    : 'Overview and progress'
                  }
                </p>
              </CardContent>
            </Card>

            {/* MON PROFIL */}
            <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 transition-all duration-300 cursor-pointer transform hover:scale-105" onClick={() => handleNavigation('/mon-profil')}>
              <CardHeader className="text-center pb-3">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Users className="w-8 h-8" />
                </div>
                <CardTitle className="text-lg">
                  {isFrench ? 'Mon profil' : 'My profile'}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center pt-0">
                <p className="text-green-100 text-sm">
                  {isFrench 
                    ? 'Votre situation, nos ressources'
                    : 'Your situation, our resources'
                  }
                </p>
              </CardContent>
            </Card>

            {/* MA RETRAITE */}
            <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white hover:from-purple-600 hover:to-purple-700 transition-all duration-300 cursor-pointer transform hover:scale-105" onClick={() => handleNavigation('/ma-retraite')}>
              <CardHeader className="text-center pb-3">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="w-8 h-8" />
                </div>
                <CardTitle className="text-lg">
                  {isFrench ? 'Ma retraite' : 'My retirement'}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center pt-0">
                <p className="text-purple-100 text-sm">
                  {isFrench 
                    ? 'Travailler avec ce qu\'on a'
                    : 'Work with what we have'
                  }
                </p>
              </CardContent>
            </Card>

            {/* MES RÉSULTATS */}
            <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 transition-all duration-300 cursor-pointer transform hover:scale-105" onClick={() => handleNavigation('/mes-resultats')}>
              <CardHeader className="text-center pb-3">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Target className="w-8 h-8" />
                </div>
                <CardTitle className="text-lg">
                  {isFrench ? 'Mes résultats' : 'My results'}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center pt-0">
                <p className="text-orange-100 text-sm">
                  {isFrench 
                    ? 'Votre progrès, nos félicitations'
                    : 'Your progress, our congratulations'
                  }
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Message d'encouragement */}
          <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200">
            <CardContent className="py-8 text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Heart className="w-8 h-8 text-red-500" />
                <h2 className="text-2xl font-bold text-gray-800">
                  {isFrench ? 'Vous n\'êtes plus seul(e)' : 'You are no longer alone'}
                </h2>
              </div>
              <p className="text-lg text-gray-700 mb-6">
                {isFrench 
                  ? 'Chaque petit pas compte vers votre sécurité financière. Commencez votre voyage avec bienveillance.'
                  : 'Every small step counts towards your financial security. Start your journey with kindness.'
                }
              </p>
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                onClick={() => handleNavigation('/mon-profil')}
              >
                {isFrench ? 'Commencer maintenant' : 'Start now'}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Accueil;
